const express = require("express");
const db = require("../database/db");
const servicesRouter = express.Router();

/* GET home page. */ Similar;
// servicesRouter.get('/', (req, res, next) =>{
//   res.render('index', { title: 'Express' });
// });

servicesRouter.get("/", (req, res, next) => {
  db.query(`SELECT * FROM services ORDER BY id ASC`)
    .then((data) => res.json(data.rows))
    .catch(next);
});

// servicesRouter.get("/:id", (req, res, next) => {
//   const { id } = req.params;
//   const service = {
//     text: "SELECT * FROM services WHERE id = $1",
//     values: [id],
//   };
//   db.query(service)
//     .then((data) => res.status(200).json(data.rows[0]))
//     .catch(next);
// });

servicesRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const servicesAndUsers = {
    text: `
    SELECT
    s.id,
    s.user_id,
    s.title,
    s.image,
    s.category,
    s.price,
    s.description,
    u.first_name,
    u.last_name,
    u.image_user,
    u.business_name,
    u.country,
    u.about
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
});
//first_name,
// last_name,
// image_user,
// type,
// business_name,
//  email, password,
//  phone_number,
//  address, city, state, country, about,
// id
servicesRouter.post("/", (req, res, next) => {
  const { user_id, title, image, category, price, description } = req.body;

  const newService = {
    text: `INSERT INTO services (user_id, title, image, category, price, description)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
    values: [user_id, title, image, category, price, description],
  };
  db.query(newService)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
});

servicesRouter.get("/similar/:id/:category", (req, res, next) => {
  const { id, category } = req.params;
  const getSimilarServicesQuery = {
    text: `
    SELECT * FROM services
    WHERE category = $1
    AND id != $2
    `,
    values: [category, id],
  };

  db.query(getSimilarServicesQuery)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
});

servicesRouter.put("/:id", (req, res, next) => {
  const { user_id, title, image, category, price, description } = req.body;
  const { id } = req.params;
  const updateService = {
    text: `
      UPDATE services
      SET user_id=$1, title=$2, image=$3, category=$4, price=$5, description=$6
      WHERE id=$7
      RETURNING *
      `,
    values: [user_id, title, image, category, price, description, id],
  };
  db.query(updateService)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
});

servicesRouter.delete("/:id", (req, res, next) => {
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
});

module.exports = servicesRouter;
