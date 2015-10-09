var express = require('express');
var http = require("http");
var https = require("https");
var app = express();



var checkForUser = function(name) {
  http.get({
    host: 'instagram.com',
    path: name
  }, function(res) {
    var body = '';
    res.on('data', function(d) {
      body += d;
    });
    res.on('end', function(){
      var parsed = JSON.stringify(body);
      console.log(parsed);
    })
  })
}

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
  checkForUser(username);
  res.render('pages/index', {
    username: username
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
