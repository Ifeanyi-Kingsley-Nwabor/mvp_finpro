const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUploader");
// const db = require("../database/db");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");
const {
  createUser,
  loginUser,
  verifyUser,
} = require("../controllers/authJwtControllers");

router.post("/register", validInfo, createUser);

router.post("/login", validInfo, loginUser);

router.get("/verify", authorize, verifyUser);

module.exports = router;
