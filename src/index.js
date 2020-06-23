/*
* Basic index file to initialize and start a Node server.
* Use this file when you want to run this application.
* */

const Hapi = require('@hapi/hapi');
const Server = require('./lib/server');

const start = async () => {
    const server = await Server.initServer();
    await server.start();
    return server;
};

if (module.parent) {
    module.exports = {
        start
    };
    return true;
}

start().then((server) => {
    console.log(`Server running at: ${server.info.uri}`);
});

