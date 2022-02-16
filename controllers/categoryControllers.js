const db = require("../database/db");

const allArt = (req, res, next) => {
  db.query(
    `
  SELECT * FROM services 
  WHERE category =  'Art'
  ORDER BY id ASC
  `
  )
    .then((data) => res.json(data.rows))
    .catch(next);
};

const allEntertainment = (req, res, next) => {
  db.query(
    `
    SELECT * FROM services 
    WHERE category =  'Entertainment'
    ORDER BY id ASC
    `
  )
    .then((data) => res.json(data.rows))
    .catch(next);
};

const allInstruments = (req, res, next) => {
  db.query(
    `
    SELECT * FROM services 
    WHERE category =  'Instrument'
    ORDER BY id ASC
    `
  )
    .then((data) => res.json(data.rows))
    .catch(next);
};

module.exports = {
  allArt,
  allEntertainment,
  allInstruments,
};
