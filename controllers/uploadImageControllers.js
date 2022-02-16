const db = require("../database/db");
const multer = require("multer");
const { upload2 } = require("../utils/imageUploader");

const uploadImage = (req, res, next) => {
  //   const { image_user } = req.body;

  const { image_user } = req.body;

  const { id } = req.params;
  console.log("gaga " + image_user);

  //   const imagePath = req.file.path;

  //   const { file, fileValidationError } = req;
  //   if (!file) return res.status(400).send("Please upload a file");
  //   if (fileValidationError) return res.status(400).send(fileValidationError);

  upload2(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    // return res.status(200).send(imagePath);
    return res.status(200).send(req.file);
  });

  const uploadProfileImage = {
    text: `SET image_user=$1
      WHERE id=$2
      RETURNING *`,
    VALUES: [image_user, id],
  };

  db.query(uploadProfileImage)
    .then((data) => {
      console.log("freemenow" + data.rows);
      res.status(201).json(data.rows);
    })
    .catch(next);
};

module.exports = { uploadImage };
