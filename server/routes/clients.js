var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/americandraperysystems';


//Get request to populate Company Name Dropdown
router.get('/', function(req, res) {
  console.log('reached get clients route')
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT client_name, id FROM client', function(err, result) {
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

//Post request to add client information
router.post('/', function(req,res) {
  console.log(req.body);
  var newClient = req.body;
  var date = new Date();
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query("INSERT INTO client (client_name, primary_contact_name, primary_contact_phone_number, primary_contact_email, alt_contact_name, alt_contact_email, alt_phone_number, billing_address_street, billing_address_city, billing_address_state, billing_address_zip, survey_address_street, survey_address_city, survey_address_state, survey_address_zip) " +
    "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) " +
    "RETURNING id",
    [newClient.client_name, newClient.primary_contact_name, newClient.primary_contact_phone_number, newClient.primary_contact_email, newClient.alt_contact_name, newClient.alt_contact_email, newClient.alt_phone_number, newClient.billing_address_street, newClient.billing_address_city, newClient.billing_address_street, newClient.billing_address_zip, newClient.survey_address_state, newClient.survey_address_city, newClient.survey_address_state, newClient.survey_address_zip],
    function(err, result) {
      done(); //close the connection
      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      console.log("client info put complete");
      //Get the id of the most recently added client
      res.send(result.rows);
    });
  });
});


//EDIT already exisiting client
router.post('/:client_id', function(req,res) {
  console.log(req.body);
  var id = req.params.client_id;
  var updatedClient = req.body;
  var date = new Date();
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query("UPDATE client " +
    "SET client_name = $1, primary_contact_name = $2, primary_contact_phone_number = $3, primary_contact_email = $4, alt_contact_name = $5, alt_contact_email = $6, alt_phone_number = $7, billing_address_street = $8, billing_address_city = $9, billing_address_state = $10, billing_address_zip = $11, survey_address_street = $12, survey_address_city = $13, survey_address_state = $14, survey_address_zip = $15",
    [updatedClient.client_name, updatedClient.primary_contact_name, updatedClient.primary_contact_phone_number, updatedClient.primary_contact_email, updatedClient.alt_contact_name, updatedClient.alt_contact_email, updatedClient.alt_phone_number, updatedClient.billing_address_street, updatedClient.billing_address_city, updatedClient.billing_address_state, updatedClient.billing_address_zip, updatedClient.survey_address_street, updatedClient.survey_address_city, updatedClient.survey_address_state, updatedClient.survey_address_zip],
    function(err, result) {
      done(); //close the connection
      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      console.log("client info put complete");
      //Get the id of the most recently added client
      res.send(result.rows);
    });
  });
});

module.exports = router;
