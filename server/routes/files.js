// var express = require('express');
// var router = express.Router();
//
// var aws = require('aws-sdk');
// var multer = require('multer');
// var multerS3 = require('multer-s3');
//
// var upload = multer({ dest: 'uploads/' });
//
// aws.config.update({
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   accessKey: process.env.AWS_ACCESS_KEY
// });
//
// router.post('/', upload.array('file', 5), function(req, res, next) {
//   console.log("File upload route hit");
//   console.log("req.files: ", req.files);
//   console.log("req.body: ", req.body);
//   res.send("Files uploaded successfully");
// });//end route
//
// var s3 = new aws.S3();
//
// module.exports = router;
