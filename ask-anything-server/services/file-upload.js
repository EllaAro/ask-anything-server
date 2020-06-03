const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: "",
  accessKeyId: "",
  region: "",
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid Mime Type, only JPEG and PNG"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: "askanything-posts-images",
    acl: "public-read",
    metadata: (req, file, cb) => cb(null, { fileName: "TESTING_METADATA" }),
    key: (req, file, cb) => cb(null, Date.now().toString()),
  }),
});

module.exports = upload;
