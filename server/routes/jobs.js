var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/american-drapery-systems';


//Get request to display all jobs on dashboard
router.get('/:survey_id', function(req, res) {
  console.log('reached get jobs route');
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM survey ' +
    'JOIN client on survey.client_id = client.id', function(err, result) {
      done(); // close the connection.

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      console.log(result.rows);
      res.send(result.rows);
    });
  });
});

//Get request to fetch specified job information(Measurements, client information and images)
router.get('/:survey_id', function(req, res) {
  console.log('reached get all jobs route route')
  console.log(req.params.survey_id);
  let survey_id = req.params.survey_id;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM measurements ' +
    'JOIN survey on measurements.survey_id = survey.id ' +
    'JOIN client on survey.client_id = client.id ' +
    'WHERE survey_id = ' + survey_id +
    ' ORDER BY area',
    function(err, result) {
      done(); // close the connection.

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      console.log(result.rows);
      res.send(result.rows);
    });
  });
});




module.exports = router;
