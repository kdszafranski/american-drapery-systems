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
    fileInfo,
    currentKey,
    areaId,
    surveyId,
    awsLocation;
var bucket = 'american-drapery-systems';
var keys = {}; //storing AWS.S3 file keys here
var fileInfo = {};
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
      keys["file_" + currentFileNumber] = currentKey; //saves each key to the keys object
      areaId = req.params.areaId;
      surveyId = req.headers.survey_id;
      awsLocation = 'survey_' + surveyId + '/' + 'area_' + areaId + '/' + currentKey;
      cb(null, awsLocation);
      console.log("Done with image upload to: ", awsLocation);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  })
});

router.post('/:areaId', upload.array('file', 10), function(req, res, next) {//max of 10 files
  res.send("Files uploaded successfully");
  fileInfo = req.body;
  pool.connect()
    .then(function(client) {
      for (var key in keys) {
        client.query("INSERT INTO files (file_info, bucket, key, area_id) " +
        "VALUES ($1, $2, $3, $4)", [fileInfo[key], bucket, keys[key], areaId])
      }
    }).then(function(result, err) {
      if(err) {
      console.log("Error in query: ", err);
    } else {
      console.log("Success!: ", result);
      res.sendStatus(201);
    }
    })
    // .catch(function(err) {
    //   console.log("Insert query error: ", err);
    //   res.sendStatus(500);
    // })
});//end route


module.exports = router;
