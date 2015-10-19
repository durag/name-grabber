var express = require('express');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/username/:id', function (req, res, next) {
  var username = req.params.id;
  var message = "That username is available, register through the Instagram app.";
  var url = "https://www.instagram.com/" + username;
  // Check Instagram for username
  request(url, function(err, res, body) {
    if (res.statusCode === 200) {
      // If the unsername is taken
      message = "Username taken, enter email to be notified when it frees up.";
    }
    console.log(message);
  });
  res.send("Whee");
  // res.render('pages/username', {
  //   response: parsed
  // });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
