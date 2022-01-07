const express = require("express");
const db = require("../database/db");
const ordersRouter = express.Router();

const {
  allOrders,
  oneOrder,
  createOrder,
  editOrder,
  deleteOrder,
} = require("../controllers/ordersControllers");

ordersRouter.get("/", allOrders);

ordersRouter.get("/:id", oneOrder);

ordersRouter.post("/", createOrder);

ordersRouter.put("/:id", editOrder);

ordersRouter.delete("/:id", deleteOrder);

module.exports = ordersRouter;
