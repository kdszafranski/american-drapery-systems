var express = require('express');
var router = express.Router();

var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var uuid = require('../modules/uuid-creator');

var bucket = "american-drapery-systems"
var keys = {};

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY
});

console.log("Access key: ", process.env.AWS_ACCESS_KEY);
console.log("Secret access key: ", process.env.AWS_SECRET_ACCESS_KEY);

var s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: function(req, file, cb) {
      cb(null, bucket);
    },
    key: function(req, file, cb) {
      var currentFile = req.files.length;
      var currentKey = uuid();
      keys["image_" + currentFile] = currentKey;
      console.log("keys in s3 key: ", keys);
      cb(null, currentKey);
    }
  })
});

router.post('/', upload.array('file', 5), function(req, res, next) {
  console.log("File upload route hit");
  console.log("req.files: ", req.files);
  var fileInfo = req.body
  console.log("req.body: ", fileInfo);
  res.send("Files uploaded successfully");
});//end route

var s3 = new aws.S3();

module.exports = router;
