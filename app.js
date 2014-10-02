var express = require('express');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var logger = require('morgan')('dev');

var app = express();
app.use(logger);

app.set('port', (process.env.PORT || 5000));

var username      = loadEnv('SMAP_USERNAME');
var password      = loadEnv('SMAP_PASSWORD');
var hostname      = loadEnv('SMAP_HOST_NAME');
var proxyHostName = loadEnv('PROXY_HOST_NAME');

var credentials = {
  user: username,
  pass: password,
  sendImmediately: false
};

function loadEnv(key) {
  var environmentVariable = process.env[key];

  if (environmentVariable) {
    return environmentVariable;
  }
  console.err('Environment variable', key, 'not set. Exiting');
  process.exit(1); // fail fast
}

function replaceHostname(body) {
  var replacePattern = new RegExp(hostname, 'g');
  return body.replace(replacePattern, proxyHostName);
};

app.all('/*', function (req, res) {
  var proxyUrl = hostname + req.url;

  request(proxyUrl, {
    auth: credentials,
    followRedirect: true,
    maxRedirects: 10,
    method: req.method
  }).spread(function(response, body) {

    console.log(req.method, response.request.href, response.statusCode);

    res.set('Content-Type', response.headers['content-type']);
    res.status(response.statusCode);

    // rewrite references to the target server to refer to this server
    res.send(replaceHostname(body));
  });
});

var server = app.listen(app.get('port'), function () {
  console.log('Listening on port %d', server.address().port);
});
