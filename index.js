var config = {
  checkInterval: (12*60) // Interval to ping Instagram for usernames, in  minutes
}

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var db = require('mongoskin').db(process.env.DATABASE_URL);
var nodemailer = require('nodemailer');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// for parsing POST requests
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_ADR,
        pass: process.env.NODEMAILER_PWD
    }
});

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
  // Add email to database
  db.collection('users').insertOne( {
    username: req.body.username,
    email: req.body.email
  } );
  // Confirm registration via email
  transporter.sendMail({
      from: 'willthefirst@gmail.com',
      to: req.body.email,
      subject: "Name Grabber is now watching @" + req.body.username + " for you",
      html: "<p>Yo,</p><p>You just registered the username @" + req.body.username + " with Name Grabber. I'll send you an email when it becomes available.</p><p>Thanks,</p><p>Will</p>"
  }, function(err, info) {
    if (err) {
      console.log(err);
      throw err;
    }
  });
  res.render('pages/thanks', {
    username: req.body.username
  });
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

// Checks database
function checkDatabase() {
  db.collection('users').find().toArray(function(err, result) {
    if (err) {
      throw err;
    }
    var current;
    for (var i = 0; i < result.length; i++) {
      current = result[i];
      checkForUsername(current.username, function(exists) {
        if(!exists) {
          // Notify the user via his email
          transporter.sendMail({
              from: 'willthefirst@gmail.com',
              to: current.email,
              subject: '@' + current.username + ' is now available on Instagram!',
              html: '<p>Yo,</p><p>The username @' + current.username + ' is now available on Instagram! Claim it using the Instagram app.</p><p>Thanks,</p><p>Will</p>'
          }, function(err, info) {
            if (err) {
              console.log(err);
              throw err;
            }
          });
          // Remove this user from the DB
          db.collection('users').remove( { username : current.username } )
        } else {
          // User still unavailable;
        }
      })
    }
  });
}

// Check stuff every 60 minutes
var checkStuff = setInterval(function(str1, str2) {
  checkDatabase();
}, (config.checkInterval * 60 * 1000) );

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
