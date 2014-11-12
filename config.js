function loadEnv(key) {
  var environmentVariable = process.env[key];

  if (environmentVariable) {
    return environmentVariable;
  }
  console.err('Environment variable', key, 'not set. Exiting');
  process.exit(1); // fail fast
}

module.exports = {
  username:      loadEnv('SMAP_USERNAME'),
  password:      loadEnv('SMAP_PASSWORD'),
  hostname:      loadEnv('SMAP_HOST_NAME'),
  proxyHostName: loadEnv('PROXY_HOST_NAME'),
  port:          (process.env.PORT || 5000)
}
