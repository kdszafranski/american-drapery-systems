
// require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var jobs = require('./routes/jobs');
var measurements = require('./routes/measurements');
var clients = require('./routes/clients')


// serve static files
app.use(express.static('public'));
app.use(bodyParser.json()); // needed for angular requests

app.use('/jobs', jobs);
app.use('/measurements', measurements);
app.use('/clients', clients);

app.get('/dashboard', function(req, res) {});


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

var portDecision = process.env.PORT || 3000;

app.listen(portDecision, function() {
  console.log("listening on port", portDecision);
});
