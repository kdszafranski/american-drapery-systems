var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/american-drapery-systems';

router.get('/', function(req, res) {
  console.log("/dashboard route hit");
  console.log("req.headers: ", req.headers);
  console.log("Decoded token: ", req.decodedToken);
  res.send("Hello World");
});//end route

pg.connect()

module.exports = router;
