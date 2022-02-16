const express = require("express");
const db = require("../database/db");
const { upload2 } = require("../utils/imageUploader");

const usersRouter = express.Router();
const { uploadImage } = require("../controllers/uploadImageControllers");

const {
  allUsers,
  oneUser,
  createUser,
  editUser,
  // uploadImage,
  listMyServices,
  deleteUser,
} = require("../controllers/userControllers");

usersRouter.get("/", allUsers);

usersRouter.get("/:id", oneUser);

usersRouter.get("/list/:id", listMyServices);

usersRouter.post("/", createUser);

usersRouter.put("/:id", editUser);

usersRouter.post("/upload", upload2.single("file"), uploadImage);

usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;
