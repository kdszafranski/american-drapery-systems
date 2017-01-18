var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var pg = require('pg');

var pool = new pg.Pool(config);

router.get('/', function(req, res) {
  console.log("/dashboard route hit");
  console.log("req.headers: ", req.headers);
  console.log("Decoded token: ", req.decodedToken);
  pool.connect()
    .then(function(client) {
      //QUERY NOT COMPLETED YET
      client.query('SELECT * FROM survey')
        .then(function(result) {
          client.release();
          console.log(result.rows);
          res.send(result.rows);
        })
        .catch(function(err) {
          console.log('select query error: ', err);
          res.sendStatus(500);
        });
    });
});//end route


module.exports = router;
