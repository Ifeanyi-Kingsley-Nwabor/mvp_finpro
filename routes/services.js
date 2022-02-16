const express = require("express");
const servicesRouter = express.Router();
const {
  allServices,
  oneService,
  createService,
  editService,
  similarServices,
  // listMyServices,
  deleteService,
} = require("../controllers/serviceControllers");

servicesRouter.get("/", allServices);

servicesRouter.get("/:id", oneService);

servicesRouter.post("/create", createService);

servicesRouter.put("/:id", editService);

servicesRouter.get("/related/:id/:category", similarServices);

// servicesRouter.get("/list/:id", listMyServices);

servicesRouter.delete("/:id", deleteService);

module.exports = servicesRouter;
