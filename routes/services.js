const express = require("express");
const db = require("../database/db");
const servicesRouter = express.Router();
const {
  allServices,
  oneService,
  createService,
  editService,
  similarServices,
  deleteService,
} = require("../controllers/serviceControllers");

servicesRouter.get("/", allServices);

servicesRouter.get("/:id", oneService);

servicesRouter.post("/", createService);

servicesRouter.put("/:id", editService);

servicesRouter.get("/related/:id/:category", similarServices);

servicesRouter.delete("/:id", deleteService);

module.exports = servicesRouter;
