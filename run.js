var Hapi = require('hapi');
var Good = require('good');
var goodConsole = require('good-console');

// DataBase
var hapiMongo = require('hapi-mongodb');
var mongoUrl = "mongodb://localhost:27017/markdown-test-task";

// Main module
var markdown = require('./index');

// Create a server with a host and port
var server = module.exports = new Hapi.Server({ debug: { request: ['error']} });

server.connection({
    host: 'localhost',
    port: 8000
});

server.register([
    // Registering logger
    {
        register: Good,
        options: {
            reporters: [{
                reporter: goodConsole,
                events: {
                    response: '*',
                    log: '*'
                }
            }]
        }
    },
    // Registering mongodb client
    {
        register: hapiMongo,
        options: {
            "url": mongoUrl
        }
    }
], function (err) {
    if (err) throw err;

    // Registering markdown plugin
    // Because of need to specify routes: {prefix: ''} currently it's impossible
    // to register markdown module along with others with this adjustment
    // also it assures that we have a proper db connection at this point
    server.register(
        {
            register: markdown,
            options: {
                // transfering connection to markdown module
                plugin: 'hapi-mongodb',
                collection: 'notes',
            }
        },
        {
            // setting prefix for markdown module
            routes: {
                prefix: '/markdown'
            }
        },

        function (err) {
            if (err) throw err;

            // Start the server
            server.start(function () {
                server.log('info', 'Server running at: ' + server.info.uri);
            });
        }
    );
});
