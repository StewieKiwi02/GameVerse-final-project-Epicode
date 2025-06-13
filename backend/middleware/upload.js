const multer = require("multer");
const path = require("path");

// Funzione per determinare la cartella in base al tipo di upload
const determineDestination = (req, file, cb) => {
  const type = req.body.uploadType || req.query.uploadType;

  let folder = "games";
  if (type === "profile") folder = "profile";
  else if (type === "banner") folder = "profileBanner";

  cb(null, path.join(__dirname, `../public/assets/${folder}`));
};

const storage = multer.diskStorage({
  destination: determineDestination,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|webp|avif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Formato immagine non supportato (jpeg, jpg, png, webp, avif)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

module.exports = upload;
