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

router.delete('/:areaId', function(req, res) {
  var areaId = req.params.areaId;
  pool.connect()
    .then(function(client) {
      client.query("DELETE from areas " +
      "WHERE id = $1",
      [areaId])
      .then(function(result) {
        client.release();
        console.log("delete complete");
        res.sendStatus(204);
      })
      .catch(function(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      });
    });
})

//update area
router.put('/notes/:area_id', function(req, res) {
  var area = req.body;
  var id = req.params.area_id;
  console.log("Reached edit new area route: ", area);
  pool.connect()
    .then(function(client) {
      client.query('UPDATE areas ' +
      'SET notes = $1 ' +
      'WHERE areas.id = $2',
      [area.notes, id])
      .then(function(result) {
        client.release();
        console.log("PUT complete");
        res.sendStatus(201);
      })
      .catch(function(err) {
        console.log("PUT unsuccesful: Notes not updated ", err);
        res.sendStatus(500);
      });
    });
});


module.exports = router;
