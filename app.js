var config  = require('./config');
var express = require('express');
var Promise = require('bluebird');
var request = require('request');
var logger  = require('morgan')('dev');
var getRawBody = require('raw-body');
var _       = require('lodash');

var app = express();
app.use(logger);

console.log("loading config:\n", config);

app.set('port', config.port);

var credentials = {
  user: config.username,
  pass: config.password,
  sendImmediately: false
};

function ignoreHeader(key) {
  return _.contains(['accept-encoding', 'cookie'], key);
}

function extractHeaders(req) {
  return _.transform(req.headers, function(headers, value, key) {
    if (ignoreHeader(key)) {
      return undefined;
    }

    if(key == 'host') {
      headers['host'] = config.hostname.replace('http://', '')
    } else {
      headers[key] = value;
    }
  });
}

function replaceHostname(body) {
  var replacePattern = new RegExp(config.hostname , 'g');
  return body.replace(replacePattern, config.proxyHostName);
}

app.use(function (req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb'
  }, function (err, body) {
    if (err) {
      return next(err);
    }

    req.body = body;
    next();
  });
});

// proxy formList route
app.get('/formList', function(req, res) {
  console.log('fetching formList');
  res.set('Content-Type', 'text/xml');

  request.get(config.hostname + '/formList', {
    auth: credentials
  }, function(err, response, body) {
    if (err) {
      res.send(err);
    } else {
      res.send(body);
    }
  });

});

app.get('/formXML', function(req, res) {
  console.log('fetching form key = %d', req.query.key);
  res.set('Content-Type', 'text/xml');

  var query = {
    key: req.query.key
  };

  request.get(config.hostname + '/formXML', {
    auth: credentials,
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

var server = app.listen(app.get('port'), function () {
  console.log('Listening on port %d', server.address().port);
});
