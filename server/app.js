
// require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var decoder = require('./modules/decoder');
var surveys = require('./routes/surveys');
var measurements = require('./routes/measurements');


// serve static files
app.use(express.static('public'));
app.use(bodyParser.json()); // needed for angular requests


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

var portDecision = process.env.PORT || 3000;

app.listen(portDecision, function() {
  console.log("listening on port", portDecision);
});

//everything below decoder requires authentication
//TO DO: Get firebase-server-account-json

app.use(decoder.token);
app.use('/dashboard', decoder.token);

app.get('/dashboard', function(req, res) {
  console.log("/dashboard route hit");
  console.log("req.headers: ", req.headers);
  console.log("Decoded token: ", req.decodedToken);
  res.send("Hello World");
});
app.use('/surveys', surveys);
app.use('/measurements', measurements);
