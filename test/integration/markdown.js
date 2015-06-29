
var expect = require("chai").expect;
var hippie = require("hippie");
var server = require("../../run.js"); // require index.js


// wait for server to run
before(function(done) {
  setTimeout(done, 500);
});


// describe('/markdown/save', function(){
//   it('should respond with json that has _id and html', function(done){
//     hippie()
//       .json()
//       .base('http://localhost:8000')
//       .post('/markdown/save')
//       .expectStatus(200)
//       .end(function(err, res, body) {
//         if (err) throw err;
//         done();
//       });
//   });
// });

describe('/markdown/get', function(){
  it('should respond with json record', function(done){
    hippie()
      .json()
      .base('http://localhost:8000')
      .get('/markdown/get?id=5591c1275ef8a0a917032fed')
      .expectStatus(200)
      .expectBody('{ "_id": "5591c1275ef8a0a917032fed" }')
      .end(function(err, res, body) {
        if (err) throw err;
        done();
      });
  });
});
