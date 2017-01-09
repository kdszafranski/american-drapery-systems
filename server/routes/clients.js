var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/american-drapery-systems';


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
  let newClient = req.body;
  let date = new Date();
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query("INSERT INTO client (client_name, primary_contact_name, primary_contact_phone_number, primary_contact_email, alt_contact_name, alt_contact_email, alt_phone_number, billing_address_street, billing_address_city, billing_address_state, billing_address_zip, survey_address_street, survey_address_city, survey_address_state, survey_address_zip) " +
    "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)",
    [newClient.client_name, newClient.primary_contact_name, newClient.primary_contact_phone_number, newClient.primary_contact_email, newClient.alt_contact_name, newClient.alt_contact_email, newClient.alt_phone_number, newClient.billing_address_street, newClient.billing_address_city, newClient.billing_address_state, newClient.billing_address_zip, newClient.survey_address_state, newClient.survey_address_city, newClient.survey_address_state, newClient.survey_address_zip],
    function(err, result) {
      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      console.log("client info put complete");
    });
    client.query("INSERT INTO survey (last_modified) " +
    "VALUES ($1)",
    [date],
    function(err, result) {
      done(); //close the connection
      if (err) {
        console.log('select query errror: ', err)
        res.sendStatus(500);
      }
      console.log("last_modified put complete");
      res.sendStatus(201);
    });
  });
});
