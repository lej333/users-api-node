// This will load config file based on NODE_ENV environment parameter.
// When no environment parameter is defined, dev/development will be used as default.

const env = require('get-env')({
    dev: ['develop', 'development', 'dev'],
    test: ['staging', 'test', 'testing'],
    prod: ['prod', 'production']
});

module.exports = require('../config/' + env);