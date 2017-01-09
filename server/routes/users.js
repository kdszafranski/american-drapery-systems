var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/american-drapery-systems';


//Checking current_users access rights
router.get('/:user_email', function(req, res) {
  console.log('reached get users route')
  let user_email = req.params.user_email
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM users WHERE email = ' + user_email, function(err, result) {
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


//Add new user
router.post('/', function(req,res) {
  console.log("REQ.BODY: ", req.body);
  var newUser = req.body;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query("INSERT INTO users (first_name, last_name, email, can_add_user, authorized) " +
    "VALUES ($1,$2,$3,$4,$5)",
    [newUser.first_name, newUser.last_name, newUser.email, newUser.can_add_user, newUser.authorized],
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
