var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var pg = require('pg');

var pool = new pg.Pool(config);

router.get('/all', function(req, res) {
  console.log('reached get users route');
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
  console.log('reached get user route');
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

//Add new user
router.post('/', function(req,res) {
  console.log("new user: ", req.body);
  var newUser = req.body;
  pool.connect()
    .then(function(client) {
      client.query("INSERT INTO users (first_name, last_name, email, can_add_user, authorized) " +
      "VALUES ($1,$2,$3,$4,$5)",
      [newUser.first_name, newUser.last_name, newUser.email, newUser.can_add_user, newUser.authorized])
      .then(function(result) {
        console.log("put complete");
        client.release();
        res.sendStatus(201);
      })
      .catch(function(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      });
    });
});

router.delete('/', function(req, res) {
  console.log('reached get user route');
  console.log("req.decodedToken: ", req.decodedToken);
  var user_email = req.decodedToken.email;
  var email_to_delete = req.body;
  pool.connect()
    .then(function(client) {
      client.query('SELECT can_edit_users FROM users WHERE email = $1', [user_email])
        .then(function(result) {
          // client.release();

          if (result.rows.can_edit_users == true) {

          }
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
