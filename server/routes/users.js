var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var pg = require('pg');

var pool = new pg.Pool(config);

router.post('/', function(req,res) {
  console.log("new user: ", req.body);
  var newUser = req.body;
  pool.connect()
    .then(function(client) {
      client.query("INSERT INTO users (first_name, last_name, email, can_edit_users, authorized) " +
      "VALUES ($1,$2,$3,$4,$5) RETURNING id",
      [newUser.first_name, newUser.last_name, newUser.email, newUser.can_edit_users, newUser.authorized])
      .then(function(result) {
        console.log("put complete");
        client.release();
        res.send(result.rows);
      })
      .catch(function(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      });
    });
});

router.get('/all', function(req, res) {
  console.log("req.decodedToken: ", req.decodedToken);
  var user_email = req.decodedToken.email;
  pool.connect()
    .then(function(client) {
      client.query('SELECT * FROM users')
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

//Checking current_users access rights
router.get('/', function(req, res) {
  console.log("req.decodedToken: ", req.decodedToken);
  var user_email = req.decodedToken.email;
  pool.connect()
    .then(function(client) {
      client.query('SELECT * FROM users WHERE email = $1', [user_email])
        .then(function(result) {
          console.log(result.rows);
          client.release();
          res.send(result.rows);
        })
        .catch(function(err) {
          console.log('select query error: ', err);
          res.sendStatus(500);
        });
    });
});

router.delete('/:delete_id', function(req, res) {
  //var user_email = req.decodedToken.email;
  var delete_id = req.params.delete_id;
  console.log("deleting user with id: ", delete_id);
  pool.connect()
    .then(function(client) {
      client.query('DELETE FROM users WHERE id = $1', [delete_id])
        .then(function(result) {
          client.release();
          console.log('user delete success');
          res.sendStatus(204);
        })
        .catch(function(err) {
          console.log('select query error: ', err);
          res.sendStatus(500);
        });
    });
});


module.exports = router;
