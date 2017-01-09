var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/american-drapery-systems';


//Post request to add new measurement information to survey
router.post('/:survey_id', function(req,res) {
  console.log(req.body);
  var newMeasurement = req.body;
  var survey_id = req.params.survey_id;
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


//Route to edit already existing measurement. measure_id refers to the row in the measurement table.
router.put('/:measure_id', function(req,res) {
  console.log(req.params.measure_id);
  var newMeasurement = req.body;
<<<<<<< HEAD
  var measure_id = req.params.measure_id;
=======
  var measure_id = req.params.measure_id);
>>>>>>> a5a582dd3a94babae489b69134ce7e8e50b3ab2f
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query('UPDATE measurements ' +
    'SET area = $1, floor = $2, room = $3, quantity = $4, width = $5, length = $6, inside = $7, outside = $8, fascia_size = $9, controls = $10, mount = $11, fabric = $12, notes = $13)' +
    'WHERE id = $14',
    [newMeasurement.area, newMeasurement.floor, newMeasurement.room, newMeasurement.quantity, newMeasurement.width, newMeasurement.length, newMeasurement.inside, newMeasurement.outside, newMeasurement.fascia_size, newMeasurement.controls, newMeasurement.mount, newMeasurement.fabric, newMeasurement.notes, measure_id],
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
