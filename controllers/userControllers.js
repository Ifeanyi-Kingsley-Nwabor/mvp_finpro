const express = require("express");
const db = require("../database/db");

const allUsers = (req, res, next) => {
  db.query(`SELECT * FROM users ORDER BY id ASC`)
    .then((data) => res.json(data.rows))
    .catch(next);
};

const oneUser = (req, res, next) => {
  const { id } = req.params;
  const user = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };
  db.query(user)
    .then((data) => res.status(200).json(data.rows))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    first_name,
    last_name,
    image_user,
    type,
    business_name,
    email,
    password,
    phone_number,
    address,
    city,
    state,
    country,
    about,
  } = req.body;

  const newUser = {
    text: `INSERT INTO users (first_name, last_name, image_user, type, business_name, email, password, phone_number, address, city, state, country, about)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING *
        `,
    values: [
      first_name,
      last_name,
      image_user,
      type,
      business_name,
      email,
      password,
      phone_number,
      address,
      city,
      state,
      country,
      about,
    ],
  };
  db.query(newUser)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
};

const editUser = (req, res, next) => {
  const {
    first_name,
    last_name,
    image_user,
    type,
    business_name,
    email,
    password,
    phone_number,
    address,
    city,
    state,
    country,
    about,
  } = req.body;
  const { id } = req.params;
  const updateUser = {
    text: `
        UPDATE users
        SET first_name=$1, last_name=$2, image_user=$3, type=$4, business_name=$5, email=$6, password=$7, phone_number=$8, address=$9, city=$10, state=$11, country=$12, about=$13
        WHERE id=$14
        RETURNING *
        `,
    values: [
      first_name,
      last_name,
      image_user,
      type,
      business_name,
      email,
      password,
      phone_number,
      address,
      city,
      state,
      country,
      about,
      id,
    ],
  };
  db.query(updateUser)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
};

const deleteUser = (req, res, next) => {
  const { id } = req.params;
  const deleteUser = {
    text: `
        DELETE FROM users
        WHERE id=$1
        RETURNING *`,
    values: [id],
  };
  db.query(deleteUser)
    .then((data) => {
      if (!data.rows.length) {
        res
          .status(404)
          .send(`The requested user does not exist or has been deleted.`);
      } else {
        res.status(200).json(data.rows);
      }
    })
    .catch(next);
};

module.exports = {
  allUsers,
  oneUser,
  createUser,
  editUser,
  deleteUser,
};
