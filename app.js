var username, password;

var express = require('express');
var request = require('request');

var app = express();
app.set('port', (process.env.PORT || 5000));

var username = process.env.SMAP_USERNAME;
var password = process.env.SMAP_PASSWORD;
var hostname = process.env.SMAP_HOST_NAME;
var proxyHostName = process.env.PROXY_HOST_NAME;

var credentials = {
  user: username,
  pass: password,
  sendImmediately: false
};

// replace the smap survey hostname with the proxy hostname
function replaceHostname(body) {
  var replacePattern = new RegExp(hostname, 'g');
  return body.replace(replacePattern, proxyHostName);
};

app.get('/', function(req, res) {
  res.send('Server up');
});

// proxy formList route
app.get('/formList', function(req, res) {
  console.log('fetching formList');
  res.set('Content-Type', 'text/xml');

  request.get(hostname + '/formList', {
    auth: credentials
  }, function(err, response, body) {
    if (err) {
      res.send(err);
    } else {
      var newBody = replaceHostname(body);
      res.send(newBody);
    }
  });

});

app.get('/formXML', function(req, res) {
  console.log('fetching form key = %d', req.query.key);
  res.set('Content-Type', 'text/xml');

  var query = {
    key: req.query.key
  };

  request.get(hostname + '/formXML', {
    auth:credentials,
    qs: query
  }, function (err, response, body) {
    console.log(response);
    if (err) {
      console.log('error: ', err);
      res.send(err);
    } else {
      console.log('body: ', body)
      res.send(body);
    }
  });

});

var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});
