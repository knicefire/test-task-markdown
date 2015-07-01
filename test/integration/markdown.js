
var expect = require('chai').expect;
var hippie = require('hippie');

var baseUrl, db, collection, collectionName, ObjectID;

// setting up env variables
process.env.NODE_ENV = 'test';
process.env.MONGO_DB_NAME = 'markdown-test-task-testing-db';
process.env.MONGO_MARKDOWN_COLLECTION = collectionName = 'notes';

var server = require('../../server.js');

// wait for server to run
before(function(done) {
    server.on('start', function(){
        baseUrl = server.info.uri;
        done();
    });
});

function request() {
    return hippie().base(baseUrl);
}

beforeEach(function(done) {
    ObjectID = server.plugins['hapi-mongodb'].ObjectID;
    db = server.plugins['hapi-mongodb'].db;
    collection = db.collection(collectionName);
    // cleanup database
    collection.remove(done);
});

describe('/markdown/get', function(){
    describe('when valid id is provided and record exists', function(done) {
        beforeEach(function(done) {
            collection.insert({
                _id: ObjectID("5591c1275ef8a0a917032fde"),
                text: '# Hello there',
                html: '<h1 id="hello-there">Hello there</h1>'
            }, done);
        });

        it('should respond with #200 and contain record', function(done){
            request()
                .get('/markdown/get?id=5591c1275ef8a0a917032fde')
                .expectStatus(200)
                .expectBody('{"_id":"5591c1275ef8a0a917032fde","text":"# Hello there","html":"<h1 id=\\"hello-there\\">Hello there</h1>"}')
                .end(done);
        });
    });

    describe('when id is not defined', function(done) {
        it('should respond #400 with bad request', function(done){
            request()
                .get('/markdown/get')
                .expectStatus(400)
                .end(done);
        });
    });

    describe('when id is invalid', function(done) {
        it('should respond with #400 bad request', function(done){
            request()
                .get('/markdown/get?id="invalidId"')
                .expectStatus(400)
                .end(done);
        });

        it('should respond with #400 bad request', function(done){
            request()
                .get('/markdown/get?id=null')
                .expectStatus(400)
                .end(done);
        });

        it('should respond with #400 bad request', function(done){
            request()
                .get('/markdown/get?id=5591c12')
                .expectStatus(400)
                .end(done);
        });
    });

    describe('when record does not exist', function(done) {
        it('should respond with #404 not found', function(done){
            request()
                .get('/markdown/get?id=5591c1275ef8a0a917032fde')
                .expectStatus(404)
                .end(done);
        });
    });
});

describe('/markdown/save', function(){
    describe('when post with non-empty body text', function() {
        it('should respond #200 with json that has _id and html', function(done){
            request()
                .post('/markdown/save')
                .header('Content-Type', 'text/plain;charset=UTF-8')
                .send('# will it work?')
                .expectStatus(200)
                .expect(function(res, body, next) {
                    try {
                        var _record = JSON.parse(body);
                        expect(_record._id).to.be.defined;
                        expect(_record._id.length).to.equal(24);
                        expect(_record.html).to.equal('<h1 id="will-it-work-">will it work?</h1>\n');
                        next();
                    }
                    catch (e) {
                        next(e);
                    }

                })
                .end(done);
        });
    });

    describe('when post with empty body text', function() {
        it('should respond #400 bad request', function(done) {
            request()
                .post('/markdown/save')
                .header('Content-Type', 'text/plain;charset=UTF-8')
                .send('')
                .expectStatus(400)
                .end(done);
        });
    });
});
