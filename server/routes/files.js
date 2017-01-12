var express = require('express');
var router = express.Router();

var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

aws.config.update({
  secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY,
  accessKey = process.env.AWS_ACCESS_KEY
});

var s3 = new aws.S3();
