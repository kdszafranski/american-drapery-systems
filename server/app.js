
// require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var surveys = require('./routes/surveys');
var measurements = require('./routes/measurements');


// serve static files
app.use(express.static('public'));
app.use(bodyParser.json()); // needed for angular requests

app.use('/surveys', surveys);
app.use('/measurements', measurements);

app.get('/dashboard', function(req, res) {});


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

var portDecision = process.env.PORT || 3000;

app.listen(portDecision, function() {
  console.log("listening on port", portDecision);
});
