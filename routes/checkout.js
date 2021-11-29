const express = require("express");
const db = require("../database/db");
const checkoutRouter = express.Router();
const validator = require("validator");

/* GET home page. */
// checkoutRouter.get('/', (req, res, next) =>{
//   res.render('index', { title: 'Express' });
// });

checkoutRouter.get("/", (req, res, next) => {
  res.json();
});
