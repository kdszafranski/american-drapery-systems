var admin = require("firebase-admin");


//Configure Firebase Admin... Insert credentials from local JSON file (.gitignore-d, of course)
admin.initializeApp({
  credential: admin.credential.cert("./server/fb-service-account.json"),
  databaseURL: "https://american-drapery-systems.firebaseio.com" //URL for out firbase user database
});

var tokenDecoder = function(req, res, next){
  // console.log("token decoder runnning. Headers: ", req.headers);
  if (req.headers.id_token) {
    // console.log("There's and id token on the request: ", req.headers.id_token);
    admin.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
      req.decodedToken = decodedToken;
      next();
    })
    .catch(function(error) {
      console.log('User token could not be verified');
      res.sendStatus(403);
    });
  } else {
    // Seems to be hit when chrome makes request for map files
    // Will also be hit when user does not send back an idToken in the header
    res.sendStatus(403);
  }
}

module.exports = { token: tokenDecoder };
