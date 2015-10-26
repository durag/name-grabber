var express = require('express');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//   response.render('pages/index');
// });

app.get('/', function (req, res, next) {
  // If this is a user query, check for user
  if (req.query.username) {
    var username = req.query.username;
    var message = "That username is available, register through the Instagram app.";

    checkForUsername(username, function(exists) {
      if (exists) {
        // Prompt for email
        console.log("user exists");
        res.render('pages/index', {
          response: 'user exists'
        });
      } else {
        // Redirect to register on Instagram
        console.log("user NO exists");
        res.render('pages/index', {
          response: 'user does not exist'
        });

      }
    });
  // or just load the home page
  } else {
    res.render('pages/index', {
      response: 'nothing'
    });
  }
});

// Handles email submissions
app.post('/email', function(req, res, next) {
  console.log(req.params.email);

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
