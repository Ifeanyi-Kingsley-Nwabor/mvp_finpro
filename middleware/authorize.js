require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const privateKey = process.env.APP_SECRET_KEY;

// const db = require("../database/db");

module.exports = async (req, res, next) => {
  try {
    const jwtToken = await req.header("token");
    console.log(jwtToken);

    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }
    const payload = await jwt.verify(jwtToken, privateKey);
    req.user = payload;
    // console.log(payload);
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json("Not Authorized");
  }
};
