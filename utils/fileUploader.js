const multer = require("multer");
const path = require("path");

// const upload2 = multer({ dest: "images/user_images" });

const uploadFolder = path.resolve("public", "emailAttachments");
// const uploadFolder2 = path.resolve(
//   "public",
//   "fotosTrial",
//   "images",
//   "user_images",
//   "service_images"
// );

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

// const storage2 = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadFolder2);
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` // will give something like: profile_pic-1624546714574.png
//       // or something simpler like: `${Date.now()}-${file.originalname}` // will give something like: 1624546714574-myOriginalImage_name.jpg
//     );
//   },
// });

// Option 2: check the mimetype and the file extension (better)
const isAllowed = ({ originalname, mimetype }) => {
  const allowedMimeTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "audio/mpeg",
    "video/mp4,",
    "application/pdf",
  ];
  return (
    originalname.match(
      /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|mpeg|MPEG|mp4|MP4|pdf|PDF)$/
    ) && allowedMimeTypes.includes(mimetype)
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

const upload = multer({ storage, fileFilter, limits });
// const upload2 = multer({ storage2, fileFilter, limits });

module.exports = {
  upload,
  // upload2,
};
