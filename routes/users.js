const express = require("express");
const db = require("../database/db");
const usersRouter = express.Router();
const {
  allUsers,
  oneUser,
  createUser,
  editUser,
  listMyServices,
  deleteUser,
} = require("../controllers/userControllers");

usersRouter.get("/", allUsers);

usersRouter.get("/:id", oneUser);

usersRouter.get("/list/:id", listMyServices);

usersRouter.post("/", createUser);

usersRouter.put("/:id", editUser);

usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;
