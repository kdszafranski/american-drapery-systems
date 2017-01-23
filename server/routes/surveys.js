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
      client.query("SELECT * FROM client " +
      "JOIN survey on survey.client_id = client.id " +
      "ORDER BY last_modified")
        .then(function (result) {
          client.release();
          // console.log(result.rows);
          res.send(result.rows);
        })
        .catch(function(err) {
          client.release();
          
          console.log('select query error: ', err);
          res.sendStatus(500);
        });
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
      // 'JOIN measurements on measurements.area_id = areas.id ' +
      'WHERE survey_id = $1', [survey_id])
        .then(function(result) {
          client.release();
          console.log(result.rows);
          res.send(result.rows);
        })
        .catch(function(err) {
          client.release();
          
          console.log('select query error: ', err);
          res.sendStatus(500);
        });
    });
});

router.get('/preview/one/:survey_id', function(req, res) {
  console.log('reached get one survey route')
  console.log(req.params.survey_id);
  var survey_id = req.params.survey_id;
  pool.connect()
    .then(function(client) {
      client.query('SELECT * FROM client ' +
      'JOIN survey on survey.client_id = client.id ' +
      'JOIN areas on areas.survey_id = survey.id ' +
      'JOIN measurements on measurements.area_id = areas.id ' +
      'WHERE survey_id = $1', [survey_id])
        .then(function(result) {
          client.release();
          console.log('get one survey success');
          res.send(result.rows);
        })
        .catch(function(err) {
          client.release();
          
          console.log('select query error: ', err);
          res.sendStatus(500);
        });
    });
});

//Get client and survey information for newly added survey
router.get('/new/:survey_id', function(req, res) {
  console.log('reached get one survey route')
  console.log(req.params.survey_id);
  var survey_id = req.params.survey_id;
  pool.connect()
    .then(function(client) {
      client.query('SELECT * FROM client ' +
      'JOIN survey on survey.client_id = client.id ' +
      'WHERE survey.id = $1', [survey_id])
        .then(function(result) {
          client.release();
          console.log('survey get success');
          res.send(result.rows);
        })
        .catch(function(err) {
          client.release();
          
          console.log('select query error: ', err);
          res.sendStatus(500);
        });
    });
});

router.delete('/:survey_id', function(req, res) {
  if (req.authorized === false) {
    res.sendStatus(403);
  } else {
    console.log('reached delete one survey route')
    console.log('deleting survey', req.params.survey_id);
    var survey_id = req.params.survey_id;
    pool.connect()
      .then(function(client) {
        client.query('DELETE FROM survey ' +
        'WHERE id = $1', [survey_id])
          .then(function(result) {
            console.log('delete success');
            client.release();
            res.sendStatus(204);
          })
          .catch(function(err) {
            client.release();
            
            console.log('select query error: ', err);
            res.sendStatus(500);
          });
      });
  }
});


//update survey
router.put('/update/:survey_id', function(req, res) {
  var survey = req.body;
  var id = req.params.survey_id;
  console.log("Reached edit new survey route: ", survey);
  pool.connect()
    .then(function(client) {
      client.query('UPDATE survey ' +
      'SET job_number = $1, survey_date=$2, completion_date=$3 ' +
      'WHERE survey.id = $4',
      [survey.job_number, survey.survey_date, survey.completion_date, id])
      .then(function(result) {
        client.release();
        console.log("PUT complete");
        res.sendStatus(201);
      })
      .catch(function(err) {
        client.release();
        
        console.log("Post unsuccesful: ", err);
        res.sendStatus(500);
      });
    });
});

//update survey status
router.put('/status/:survey_id', function(req, res) {
  var status = req.body;
  var id = req.params.survey_id;
  console.log(`Editing survey #${id} to a status of ${status.status}`);
  pool.connect()
    .then(function(client) {
      client.query('UPDATE survey ' +
      'SET status = $1, last_modified=$2' +
      'WHERE survey.id = $3',
      [status.status, status.last_modified, id])
      .then(function(result) {
        client.release();
        console.log("PUT complete");
        res.sendStatus(200);
      })
      .catch(function(err) {
        client.release();
        
        console.log("Post unsuccesful: ", err);
        res.sendStatus(500);
      });
    });
});

//add new survey

router.post('/', function(req, res) {
  var newSurvey = req.body;
  console.log("Reached add new survey route: ", newSurvey);
  pool.connect()
    .then(function(client) {
      client.query('INSERT INTO survey (survey_date, status, client_id, last_modified) ' +
      'VALUES ($1, $2, $3, $4) ' +
      'RETURNING id',
      [newSurvey.survey_date, newSurvey.status, newSurvey.client_id, newSurvey.last_modified])
      .then(function(result) {
        client.release();
        console.log("post complete");
        res.send(result.rows);
      })
      .catch(function(err) {
        client.release();
        
        console.log("Post unsuccesful: ", err);
        res.sendStatus(500);
      });
    });
});


module.exports = router;
