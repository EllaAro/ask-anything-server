const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: "",
  accessKeyId: "",
  region: "",
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "somebucket",
    metadata: (req, file, cb) => cb(null, { fileName: file.filename }),
    key: (req, file, cb) => cb(null, Data.now().toString()),
  }),
});
