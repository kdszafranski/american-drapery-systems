require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var decoder = require('./modules/decoder');
var surveys = require('./routes/surveys');
var measurements = require('./routes/measurements');
var dashboard = require('./routes/dashboard');
var clients = require('./routes/clients');
var users = require('./routes/users');
var areas = require('./routes/areas');
var testdata = require('./routes/testdata');
var files = require('./routes/files');
var userChecker = require('./modules/user-checker');

//create ~10,000 test data
// for (var i = 0; i < 33; i++) {
//   testdata.client();
// }

// serve static files
app.use(express.static('public'));
app.use(bodyParser.json()); // needed for angular requests



// app.get('/dashboard', function(req, res) {});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

var portDecision = process.env.PORT || 3000;

app.listen(portDecision, function() {
  console.log("listening on port", portDecision);
});

//everything below decoder requires authentication
//TODO: Get firebase-server-account-json

app.use(decoder.token);
app.use(userChecker.user);

app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/surveys', surveys);
app.use('/files', files);
app.use('/measurements', measurements);
app.use('/clients', clients);
app.use('/areas', areas);
