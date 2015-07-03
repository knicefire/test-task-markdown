var Hapi = require('hapi');
var Good = require('good');
var goodConsole = require('good-console');

// DataBase
var hapiMongo = require('hapi-mongodb');

var dbName = process.env.MONGO_DB_NAME || 'markdown-test-task';
var mongoUrl = 'mongodb://localhost:27017/' + dbName;

var markdownCollectionName = process.env.MONGO_MARKDOWN_COLLECTION || 'notes';

// Main module
var markdown = require('./index');

// Create a server with a host and port
var server = module.exports = new Hapi.Server();

server.connection({
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT, 10) || 8000
});


// Reports filtering function
// mutes reporters under test environment
var getReporters = function(reporters) {
    return process.env.NODE_ENV === 'test' ? [] : reporters;
};

var handleError = function(error) {
    if (error) {
        console.error(error);
        process.exit();
    }
};

server.register([
    // Registering logger
    {
        register: Good,
        options: {
            reporters: getReporters([{
                reporter: goodConsole,
                events: {
                    response: '*',
                    log: '*'
                }
            }])
        }
    },
    // Registering mongodb client
    {
        register: hapiMongo,
        options: {
            url: mongoUrl
        }
    }
], function (err) {
    handleError(err);

    // Registering markdown plugin
    // Because of need to specify routes: {prefix: ''} currently it's impossible
    // to register markdown module along with others with this adjustment
    // also it assures that we have an established db connection at this point
    server.register(
        {
            register: markdown,
            options: {
                // transfering connection to markdown module
                plugin: 'hapi-mongodb',
                collection: markdownCollectionName,
            }
        },
        {
            // setting prefix for markdown module
            routes: {
                prefix: '/markdown'
            }
        },

        function (err) {
            handleError(err);

            // Start the server
            server.start(function () {
                server.log('info', 'Server running at: ' + server.info.uri);
            });
        }
    );
});
