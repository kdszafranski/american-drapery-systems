var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var pg = require('pg');

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


var s3 = new aws.S3();
// var pool = new pg.pool(config);

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
      cb(null, 'testfolder/' + currentKey);
    }
  })
});

// router.use('/', bucketKey);
router.post('/:areaId', upload.array('file', 10), function(req, res, next) {
  var areaId = req.params.areaId;
  var fileInfo = req.body
  res.send("Files uploaded successfully");
});//end route


module.exports = router;
