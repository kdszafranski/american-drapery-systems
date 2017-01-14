var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var pg = require('pg');

var pool = new pg.Pool(config);

//Get request to display ALL jobs on dashboard
router.get('/all', function(req, res) {
  console.log('reached get jobs route');
  pool.connect()
    .then(function(client) {
      client.query("SELECT * FROM survey " +
      "JOIN client on survey.client_id = client.id " +
      "ORDER BY last_modified")
        .then(function (result) {
          client.release();
          // console.log(result.rows);
          res.send(result.rows);
        })
        .catch(function(err) {
          console.log('select query error: ', err);
          res.sendStatus(500);
        })
    });
});

//Get request to fetch specified job information(Measurements, client information and images)
router.get('/one/:survey_id', function(req, res) {
  console.log('reached get one survey route')
  console.log(req.params.survey_id);
  var survey_id = req.params.survey_id;
  pool.connect()
    .then(function(client) {
      client.query('SELECT * FROM client ' +
      'JOIN survey on survey.client_id = client.id ' +
      'JOIN areas on areas.survey_id = survey.id ' +
//    'JOIN measurements on measurements.area_id = areas.id ' +
      'WHERE survey_id = $1', [survey_id])
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
});




module.exports = router;
