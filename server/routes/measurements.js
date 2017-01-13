var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var pg = require('pg');

var pool = new pg.Pool(config);

//Post request to add new measurement information to survey
router.post('/:survey_id', function(req,res) {
  console.log(req.body);
  var newMeasurement = req.body;
  var survey_id = req.params.survey_id;
  pool.connect()
    .then(function(client) {
      client.query("INSERT INTO measurements (area, floor, room, quantity, width, length, inside, outside, fascia_size, controls, mount, fabric, notes, survey_id) " +
      "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
      [newMeasurement.area, newMeasurement.floor, newMeasurement.room, newMeasurement.quantity, newMeasurement.width, newMeasurement.length, newMeasurement.inside, newMeasurement.outside, newMeasurement.fascia_size, newMeasurement.controls, newMeasurement.mount, newMeasurement.fabric, newMeasurement.notes, survey_id])
      .then(function(result) {
        console.log("put complete");
        res.sendStatus(201);
      })
      .catch(function(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      });
    });
});


//Route to edit already existing measurement. measure_id refers to the row in the measurement table.
router.put('/:measure_id', function(req,res) {
  console.log(req.params.measure_id);
  var newMeasurement = req.body;
  var measure_id = req.params.measure_id;
  pool.connect()
    .then(function(client) {
      client.query('UPDATE measurements ' +
      'SET area = $1, floor = $2, room = $3, quantity = $4, width = $5, length = $6, inside = $7, outside = $8, fascia_size = $9, controls = $10, mount = $11, fabric = $12, notes = $13)' +
      'WHERE id = $14',
      [newMeasurement.area, newMeasurement.floor, newMeasurement.room, newMeasurement.quantity, newMeasurement.width, newMeasurement.length, newMeasurement.inside, newMeasurement.outside, newMeasurement.fascia_size, newMeasurement.controls, newMeasurement.mount, newMeasurement.fabric, newMeasurement.notes, measure_id])
      .then(function(result) {
        console.log("put complete");
        res.sendStatus(201);
      })
      .catch(function(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      });
    });
});

router.get('/:area_id', function(req, res) {
  var area_id = req.params.area_id;
  pool.connect()
    .then(function(measurements) {
      client.query('SELECT * FROM measurements JOIN areas on areas.id = measurements.area_id WHERE areas.id = $1', +
      [area_id])
      .then(function(results) {
        console.log("Received these results from the measurements table: ", results);
        res.send(results.rows);
      })
      .catch(function(err) {
        console.log("select query error: ", err);
        res.sendStatus(500);
      })
    })
});


module.exports = router;
