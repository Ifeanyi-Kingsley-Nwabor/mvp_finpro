const express = require("express");
const loginRouter = express.Router();
const jwt = require("jsonwebtoken");

const privateKey = process.env.APP_SECRET_KEY;

module.exports = loginRouter;
