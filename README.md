# SMAP Server Proxy

Dependencies
------------

- NodeJS
- NPM

_optional_
- [Direnv](http://direnv.net/)

Deployment
----------

This app is deployed to Heroku

Local Development
----------

```bash
# pull down the repository
git clone git@github.com:smap-consulting/smap-http-proxy.git

# install the dependencies
npm install

# set the environment variables (or use direnv)
export SMAP_USERNAME=myuser
export SMAP_PASSWORD=mypassword
export SMAP_HOST_NAME=http://mysmap.smap.com.au

# run the app
forever -w app.js
```

Environment Variables
---------------------

`SMAP_USERNAME` - Username for your SMAP instance
`SMAP_PASSWORD` - Password for your SMAP instance
`SMAP_HOST_NAME` - Hostname for your SMAP server instance
`PORT` - Defaults to 5000, provided by heroku
