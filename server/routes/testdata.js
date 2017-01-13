//var faker = require('faker');
// testdata.user();
// var areaSize = testdata.randInt(3,30);
// var area = faker.name.jobArea();
// var floor = testdata.randInt(1,100);

// for(var i=0; i<1000; i++) {
//   testdata.client();
// }
// for(var i=0; i<1000; i++) {
//   testdata.survey(i + 1);
// }
// for(var i=0; i<1000; i++) {
//   testdata.measurement(i + 1, area, floor);
//   if (i == areaSize) {
//     areaSize += testdata.randInt(3,30);
//     area = faker.name.jobArea();
//     floor = testdata.randInt(1,100)
//   }
// }
var express = require('express');
var router = express.Router();
var pg = require('pg');
var faker = require('faker');
var connectionString = 'postgres://localhost:5432/americandraperysystems';
var count;
function testUser() {
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
    }
    client.query("INSERT INTO users (first_name, last_name, email, can_add_user, authorized) " +
    "VALUES ($1,$2,$3,$4,$5)",
    [faker.name.firstName(), faker.name.lastName(), faker.internet.email(), true, true],
    function(err, result) {
      done(); // close the connection.
      if(err) {
        console.log('select query error: ', err);
      }
    });
  });
}

function testClient() {
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
    }
    client.query("INSERT INTO client (client_name, primary_contact_name, primary_contact_phone_number, primary_contact_email, alt_contact_name, alt_phone_number, alt_contact_email, billing_address_street, billing_address_city, billing_address_state, billing_address_zip, survey_address_street, survey_address_city, survey_address_state, survey_address_zip) " +
    "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) " +
    "RETURNING id",
    [faker.company.companyName(), faker.name.findName(), faker.phone.phoneNumber(), faker.internet.email(), faker.name.findName(), faker.phone.phoneNumber(), faker.internet.email(), faker.address.streetName(), faker.address.city(), faker.address.state(), faker.address.zipCode(), faker.address.streetName(), faker.address.city(), faker.address.state(), faker.address.zipCode()],
    function(err, result) {
      done(); //close the connection
      console.log('client result', result.rows[0].id);
      var num = randInt(1,6);
      for (var i = 0; i < num; i++) {

        testSurvey(result.rows[0].id, faker.name.findName())
      }
      if(err) {
        console.log('select query error: ', err);
      }
      //Get the id of the most recently added client
    });
  });
}

function testSurvey(client_id, installed_by) {
  pg.connect(connectionString, function(err, survey, done) {
    if(err) {
      console.log('connection error: ', err);
    }
    survey.query("INSERT INTO survey (job_number, completion_date, survey_date, installed_by, status, last_modified, client_id) " +
    "VALUES ($1,$2,$3,$4,$5,$6,$7) " +
    "RETURNING id",
    [randInt(10001, 40000), faker.date.future(), faker.date.past(), installed_by, status(), faker.date.recent(), client_id],
    function(err, result) {
      done();
      var num = randInt(1,20);
      for (var i = 0; i < num; i++) {

        testArea(result.rows[0].id);
      } //close the connection

      if(err) {
        console.log('select query error: ', err);
      }
      //Get the id of the most recently added client
    });
  });
}

function testArea(survey_id) {
  pg.connect(connectionString, function(err, survey, done) {
    if(err) {
      console.log('connection error: ', err);
    }
    survey.query("INSERT INTO areas (notes, area_name, survey_id) " +
    "VALUES ($1,$2,$3) " +
    "RETURNING id",
    [randNote(), faker.name.jobArea(), survey_id],
    function(err, result) {
      done(); //close the connection
      var num = randInt(1,15);
      for (var i = 0; i < num; i++) {

        testMeasurement(result.rows[0].id, randInt(1,50));
      }
      if(err) {
        console.log('select query error: ', err);
      }
      //Get the id of the most recently added client
    });
  });
}

function testMeasurement(area_id, floor) {
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
    }
    client.query("INSERT INTO measurements (floor, room, quantity, width, length, ib_ob, fascia_size, controls, mount, fabric, area_id) " +
    "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
    [floor, randInt(1,9000), randInt(1,8), rand(1,200), rand(1,200), inOut(), randInt(1,200), rightLeft(), faker.lorem.word() + ' Fascia', faker.lorem.word() + faker.lorem.word(), area_id],
    function(err, result) {
      done(); // close the connection.
      if(err) {
        ret();
        console.log('select query error: ', err);
      }
    });
  });
}


function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randNote() {
  if (Math.random() > 0.2) {
    return faker.lorem.sentence() + 'ladder' + faker.lorem.sentence();
  } else {
    return '';
  }
}

function status() {
  switch (randInt(1,5)) {
    case 1:
      return "Declined";
      break;
    case 2:
      return "In Progress";
      break;
    case 3:
      return "Completed";
      break;
    case 4:
      return "Pending";
      break;
  }
}

function rightLeft() {
  if(randBool) {
    return 'Right';
  } else {
    return 'Left';
  }
}

function inOut() {
  if(randBool) {
    return 'Inside';
  } else {
    return 'Outside';
  }
}
function randBool() {
  var randomBool =  Math.random() > 0.5;
  return randomBool;
}
function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
module.exports.user = testUser;
module.exports.survey = testSurvey;
module.exports.measurement = testMeasurement;
module.exports.client = testClient;
module.exports.randInt = randInt;
