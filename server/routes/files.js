var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var pg = require('pg');

var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var uuid = require('../modules/uuid-creator');

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY
});

/**********************************************
                GLOBAL STORAGE
***********************************************/
var currentFileNumber,
    currentKey,
    areaId,
    surveyId,
    awsLocation;
var bucket = 'american-drapery-systems';
var keys = {}; //storing AWS.S3 file keys here
var s3 = new aws.S3();
var pool = new pg.Pool(config);
/**********************************************
                 AMAZON UPLOAD
***********************************************/
var upload = multer({
  //We iterate over everything below for each file in the FileList
  storage: multerS3({
    s3: s3,
    bucket: function(req, file, cb) {
      cb(null, bucket);
    },
    key: function(req, file, cb) {
      currentFileNumber = req.files.length;//files.length increments by one each iteration and corresponds with file number
      currentKey = uuid();//each file needs a uuid for a key
      keys["image_" + currentFileNumber] = currentKey; //saves each key to the keys object
      areaId = req.params.areaId;
      surveyId = req.headers.survey_id;
      awsLocation = 'survey_' + surveyId + '/' + 'area_' + areaId + '/' + currentKey;
      cb(null, awsLocation);
      console.log("Done with image upload to: ", awsLocation);
    }
  })
});

router.post('/:areaId', upload.array('file', 10), function(req, res, next) {//max of 10 files
  console.log("Does this happen next?");
  res.send("Files uploaded successfully");
});//end route


module.exports = router;
