const express = require("express");

const db = require("../database/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const privateKey = process.env.APP_SECRET_KEY;

module.exports = async (req, res, nex) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }
    const payload = jwt.verify(jwtToken, privateKey);
    req.user = payload.user;
  } catch (err) {
    console.error(err.message);
    res.status(403).json("Not Authorized");
  }
};
