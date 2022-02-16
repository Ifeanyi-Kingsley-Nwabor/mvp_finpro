const express = require("express");
const categoryRouter = express.Router();

const {
  allArt,
  allEntertainment,
  allInstruments,
} = require("../controllers/categoryControllers");

categoryRouter.get("/art", allArt);

categoryRouter.get("/entertainment", allEntertainment);

categoryRouter.get("/instruments", allInstruments);

module.exports = categoryRouter;
