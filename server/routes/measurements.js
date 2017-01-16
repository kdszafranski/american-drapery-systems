var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var pg = require('pg');

var pool = new pg.Pool(config);

//Post request to add new measurement information to survey
router.put('/:area_id', function(req,res) {
  console.log("Req.body in Post: ", req.body);
  var newMeasurement = req.body;
  var area_id = req.params.area_id;
  console.log(area_id);
  pool.connect()
    .then(function(client) {
      client.query("INSERT INTO measurements (floor, room, quantity, width, length, ib_ob, fascia_size, controls, mount, fabric, area_id) " +
      "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
      [newMeasurement.floor, newMeasurement.room, newMeasurement.quantity, newMeasurement.width, newMeasurement.length, newMeasurement.ib_ob, newMeasurement.fascia_size, newMeasurement.controls, newMeasurement.mount, newMeasurement.fabric, area_id])
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
router.put('/', function(req,res) {
  console.log("Req.body from measurement update: ", req.body);
  var newMeasurement = req.body;
  pool.connect()
    .then(function(client) {
      client.query('UPDATE measurements ' +
      'SET floor = $1, room = $2, quantity = $3, width = $4, length = $5, ib_ob = $6, controls = $7, fascia_size = $8, fabric = $9, mount = $10 ' +
      'WHERE id = $11',
      [newMeasurement.floor, newMeasurement.room, newMeasurement.quantity, newMeasurement.width, newMeasurement.length, newMeasurement.ib_ob, newMeasurement.controls, newMeasurement.fascia_size, newMeasurement.fabric, newMeasurement.mount, newMeasurement.id])
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
  console.log("In measurements - area_id: ", area_id);
  pool.connect()
    .then(function(client) {
      client.query('SELECT * FROM areas ' +
      'JOIN measurements on measurements.area_id = areas.id ' +
      'WHERE areas.id = $1',
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


router.delete('/:idToDelete', function(req, res) {
  var idToDelete = req.params.idToDelete;
  pool.connect()
    .then(function(client) {
      client.query('DELETE FROM measurements ' +
      'WHERE id = $1',
      [idToDelete])
      .then(function(results) {
        console.log("Delete complete");
        res.sendStatus(201);
      })
      .catch(function(err) {
        console.log("Error with delete: ", err);
        res.sendStatus(501);
      })
    })
})

module.exports = router;
