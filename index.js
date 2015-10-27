var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// for parsing POST requests
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//   response.render('pages/index');
// });

app.get('/', function (req, res, next) {
  // If this is a user query, check for user
  if (req.query.username) {
    checkForUsername(req.query.username, function(exists) {
      res.render('pages/response', {
        exists: exists,
        username: req.query.username
      });
    });
  // or just load the home page
  } else {
    res.render('pages/index');
  }
});

// Handles email submissions
app.post('/email', function(req, res, next) {
  res.send(req.body.email);
  // Add email to database

});

// Check Instagram to see if user exists
function checkForUsername(username, cb) {
  var url = "https://www.instagram.com/" + username;
  var exists = false;
  request(url, function(err, res, body) {
    if (res.statusCode === 200) {
      // If the unsername is taken, update message and ask for user's email
      exists = true;
    }
    cb(exists);
  });
}

// Check database 2x / day
function checkDatabase() {
  for (var i = 0; i < usernames.length; i++) {
    checkForUsernames(usernames[i], function(exists) {
      if(exists) {
        // if exists, email users email and remove this userns email from the database
      }
    })
  }
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
