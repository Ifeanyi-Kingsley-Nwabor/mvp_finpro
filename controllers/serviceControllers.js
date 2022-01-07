const express = require("express");
const db = require("../database/db");

const allServices = (req, res, next) => {
  db.query(`SELECT * FROM services ORDER BY id ASC`)
    .then((data) => res.json(data.rows))
    .catch(next);
};

const oneService = async (req, res, next) => {
  const { id } = req.params;
  const servicesAndUsers = {
    text: `
      SELECT
      s.id,
      s.user_id,
      s.title,
      s.image,
      s.image_2,
      s.image_3,
      s.image_4,
      s.category,
      s.price,
      s.description,
      u.first_name,
      u.last_name,
      u.image_user,
      u.business_name,
      u.country,
      u.about,
      u.email
      FROM services s
      JOIN users u
      ON u.id = s.user_id
      WHERE s.id = $1
      `,
    values: [id],
  };

  const serviceReviews = {
    text: `
      SELECT
        r.id,
        r.service_id,
        r.text,
        r.user_id,
        r.date,
        r.rating
      FROM reviews r
      JOIN services s
      ON r.service_id = s.id
      WHERE s.id = $1
      `,
    values: [id],
  };
  try {
    const { rows: servicesAndUsersData } = await db.query(servicesAndUsers);
    const { rows: reviewsData } = await db.query(serviceReviews);

    const result = {
      ...servicesAndUsersData["0"],
      reviews: reviewsData,
    };
    res.json(result);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const createService = (req, res, next) => {
  const {
    user_id,
    title,
    image,
    image_2,
    image_3,
    image_4,
    category,
    price,
    description,
  } = req.body;

  const newService = {
    text: `INSERT INTO services (user_id, title, image, image_2, image_3, image_4, category, price, description)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
    values: [
      user_id,
      title,
      image,
      image_2,
      image_3,
      image_4,
      category,
      price,
      description,
    ],
  };
  db.query(newService)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
};

const editService = (req, res, next) => {
  const {
    user_id,
    title,
    image,
    image_2,
    image_3,
    image_4,
    category,
    price,
    description,
  } = req.body;
  const { id } = req.params;
  const updateService = {
    text: `
        UPDATE services
        SET user_id=$1, title=$2, image=$3, image_2=$4, image_3=$5, image_4=$6, category=$7, price=$8, description=$9
        WHERE id=$10
        RETURNING *
        `,
    values: [
      user_id,
      title,
      image,
      image_2,
      image_3,
      image_4,
      category,
      price,
      description,
      id,
    ],
  };
  db.query(updateService)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
};

const similarServices = (req, res, next) => {
  const { id, category } = req.params;
  const getRelatedServicesQuery = {
    text: `
      SELECT * FROM services
      WHERE category = $1
      AND id != $2
      `,
    values: [category, id],
  };

  db.query(getRelatedServicesQuery)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
};

const deleteService = (req, res, next) => {
  const { id } = req.params;
  const deleteService = {
    text: `
        DELETE FROM services
        WHERE id=$1
        RETURNING *`,
    values: [id],
  };
  db.query(deleteService)
    .then((data) => {
      if (!data.rows.length) {
        res.status(404).send(`Invalid request.`);
      } else {
        res.status(200).json(data.rows);
      }
    })
    .catch(next);
};

module.exports = {
  allServices,
  oneService,
  createService,
  editService,
  similarServices,
  deleteService,
};
