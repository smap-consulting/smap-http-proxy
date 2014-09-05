var username, password;

var express = require('express');
var request = require('request');

var app = express();
app.set('port', (process.env.PORT || 5000));

var username = process.env.SMAP_USERNAME;
var password = process.env.SMAP_PASSWORD;
var hostname = process.env.SMAP_HOST_NAME;

var credentials = {
  user: username,
  pass: password,
  sendImmediately: false
};

app.get('/', function(req, res) {
  res.send('Server up');
});

// proxy formList route
app.get('/formList', function(req, res) {
  request.get(hostname + '/formList', {
    auth: credentials
  }, function(err, response, body) {
    if (err) {
      res.send(err);
    } else {
      res.send(body);
    }
  });
});

var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});
