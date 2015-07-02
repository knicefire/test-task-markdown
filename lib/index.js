var parser = require('./markdown-parser');
var Joi = require('joi');   // hapi validation module
var Boom = require('boom'); // hapi http error objects

var db, collection, ObjectID;

exports.register = function (server, options, next) {
    // set up variables
    ObjectID = server.plugins[options.plugin].ObjectID;
    db = server.plugins[options.plugin].db;
    collection = db.collection(options.collection);

    /**
     * Returns record stored in database
     * @param {ObjectID} String that is convertable to Mongo's ObjectID
     */
    server.route({
        method: 'GET',
        path: '/get',
        handler: function(request, reply) {
            var query = {_id: ObjectID(request.query.id)};

            collection.findOne(query, function(err, result) {
                if (err) {
                    return reply(Boom.internal('Internal MongoDB error', err));
                }

                if (!result) {
                    return reply(Boom.notFound('Record not found'));
                }

                reply(result);
            });
        },
        config: {
            validate: {
                query: {
                    // Simplified mongo's objectId validation
                    id: Joi.string().required().length(24)
                }
            }
        }
    });

    /**
     * Converts markdown text into HTML and stores it in database
     * @param {String} Markdown sting provided in payload
     * @response {JSON} Object that has record _id and resulted HTML string
     */
    server.route({
        method: 'POST',
        path: '/save',
        handler: function(request, reply) {
            var payload = request.payload;

            // validation
            if (!(payload && typeof payload === 'string')) {
                return reply(Boom.badRequest('No data'));
            }

            var query = {
                markdown: payload,
                html: parser(payload)
            };

            collection.insert(query, function(err, result) {
                if (err) {
                    return reply(Boom.internal('Internal MongoDB error', err));
                }
                var item = result.ops[0];

                reply({
                    _id: item._id,
                    html: item.html
                });
            });
        }
    });

    // Passing controll to the next module
    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
