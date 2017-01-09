var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/american-drapery-systems';


//Post request to add measurement information to job
router.post('/:survey_id', function(req,res) {
  console.log(req.body);
  let newMeasurement = req.body;
  let survey_id = req.params.survey_id;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query("INSERT INTO measurements (area, floor, room, quantity, width, length, inside, outside, fascia_size, controls, mount, fabric, notes, survey_id) " +
    "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
    [newMeasurement.area, newMeasurement.floor, newMeasurement.room, newMeasurement.quantity, newMeasurement.width, newMeasurement.length, newMeasurement.inside, newMeasurement.outside, newMeasurement.fascia_size, newMeasurement.controls, newMeasurement.mount, newMeasurement.fabric, newMeasurement.notes, survey_id],
    function(err, result) {
      done(); // close the connection.

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      console.log("put complete");
      res.sendStatus(201);
    });
  });
});

module.exports = router;
