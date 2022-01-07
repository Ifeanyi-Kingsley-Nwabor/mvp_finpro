const express = require("express");
const db = require("../database/db");

const allOrders = (req, res, next) => {
  db.query(`SELECT * FROM orders ORDER BY id ASC`)
    .then((data) => res.json(data.rows))
    .catch(next);
};

const oneOrder = (req, res, next) => {
  const { id } = req.params;
  const order = {
    text: "SELECT * FROM orders WHERE id = $1",
    values: [id],
  };
  db.query(order)
    .then((data) => res.status(200).json(data.rows[0]))
    .catch(next);
};

const createOrder = (req, res, next) => {
  const { user_id, status, date } = req.body;

  const newOrder = {
    text: `INSERT INTO orders (user_id, status, date)
        VALUES($1,$2,$3,)
        RETURNING *
        `,
    values: [user_id, status, date],
  };
  db.query(newOrder)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
};
const editOrder = (req, res, next) => {
  const { user_id, status, date } = req.body;
  const { id } = req.params;
  const updateOrder = {
    text: `
        UPDATE orders
        SET user_id=$1, status=$2, date=$3
        WHERE id=$4
        RETURNING *
        `,
    values: [user_id, status, date, id],
  };
  db.query(updateOrder)
    .then((data) => res.status(201).json(data.rows))
    .catch(next);
};

const deleteOrder = (req, res, next) => {
  const { id } = req.params;
  const removeOrder = {
    text: `
        DELETE FROM orders
        WHERE id=$1
        RETURNING *`,
    values: [id],
  };
  db.query(removeOrder)
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
  allOrders,
  oneOrder,
  createOrder,
  editOrder,
  deleteOrder,
};
