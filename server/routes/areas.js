var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var pg = require('pg');

var pool = new pg.Pool(config);


router.post('/', function(req,res) {
  console.log(req.body);
  var newArea = req.body;
  console.log("NewArea: ", newArea);
  pool.connect()
    .then(function(client) {
      client.query("INSERT INTO areas (area_name, survey_id) " +
      "VALUES ($1,$2) " +
      "RETURNING id",
      [newArea.area_name, newArea.survey_id])
      .then(function(result) {
        client.release();
        console.log("area info put complete");
        //Get the id of the most recently added area
        res.send(result.rows);
      })
      .catch(function(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      });
    });
});

router.delete('/', function(req, res) {
  var ids = req.query.id;
  var string = "(";
  //parse array into SQL string
  for (var i = 0; i < ids.length; i++) {
    string+= ids[i] + ',';
  }
  string = string.substring(0, string.length-1);
  string+=')';
  console.log('delstring, ids', string, ids);
  pool.connect()
    .then(function(client) {
      client.query("DELETE from areas " +
      "WHERE id in " + string)
      .then(function(result) {
        client.release();
        console.log("delete complete");
        res.sendStatus(204);
      })
      .catch(function(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      } );
    });
});

module.exports = router;
