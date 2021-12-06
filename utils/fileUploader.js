const multer = require("multer");
const path = require("path");

const uploadFolder = path.resolve("public", "emailAttachments");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` // will give something like: profile_pic-1624546714574.png
      // or something simpler like: `${Date.now()}-${file.originalname}` // will give something like: 1624546714574-myOriginalImage_name.jpg
    );
  },
});

// Option 2: check the mimetype and the file extension (better)
const isPicture = ({ originalname, mimetype }) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
  ];
  return (
    originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/) &&
    allowedMimeTypes.includes(mimetype)
  );
};

const fileFilter = (req, file, cb) => {
  if (!isPicture(file)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
