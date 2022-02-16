const multer = require("multer");
const path = require("path");

// const upload2 = multer({ dest: "images/user_images" });
// const uploadFolder2 = path.resolve(
//   "public",
//   "images",
//   "user_images",
//   "service_images"
// );

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "fotosTrial");
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
const isAllowed = ({ originalname, mimetype }) => {
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

const limits = {
  fileSize: 1000000000,
};

const fileFilter = (req, file, cb) => {
  if (!isAllowed(file)) {
    req.fileValidationError = "Invalid File!";
    return cb(new Error("Invalid File!"), false);
  }
  cb(null, true);
};

const upload2 = multer({ storage: multerStorage, fileFilter, limits });

module.exports = {
  upload2,
};
