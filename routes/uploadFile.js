const express = require("express");
const db = require("../database/db");
const uploadRouter = express.Router();
const multer = require("multer");
const { upload } = require("../utils/fileUploader");

uploadRouter.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

module.exports = uploadRouter;
