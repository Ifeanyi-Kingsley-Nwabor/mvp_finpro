var express = require("express");
const db = require("../database/db");
var servicesRouter = express.Router();

/* GET home page. */
// servicesRouter.get('/', (req, res, next) =>{
//   res.render('index', { title: 'Express' });
// });

servicesRouter.get("/", (req, res, next) => {
  db.query(`SELECT * FROM services JOIN users ON users.id = services.user_id ORDER BY services.id ASC`)
    .then((data) => res.json(data.rows))
    .catch(next);
});

servicesRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const service = {
    text: "SELECT * FROM services WHERE id = $1",
    values: [id],
  };
  db.query(service)
    .then((data) => res.status(200).json(data.rows[0]))
    .catch(next);
});
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
        res
          .status(404)
          .send(
            `The requested service does not exist!! Please checkout our latest available services.`
          );
      } else {
        res.status(200).json(data.rows);
      }
    })
    .catch(next);
});

module.exports = servicesRouter;
