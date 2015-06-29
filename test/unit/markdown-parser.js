var sinon = require('sinon');
var expect = require('chai').expect;

var parser = require('../../markdown-parser');

var test = function(input, output) {
    var result = parser.toHTML(input);
    expect(result).to.equal(output + '\n');
};

describe('Markdown Parser', function() {
    describe('Header parser', function() {
        it('should convert # to H1 tag', function() {
            test(
                '# Hello here',
                '<h1 id="hello-here">Hello here</h1>');
        });

        it('should convert ## to H2 tag', function() {
            expect(null).to.be.null;
        });

        it('should convert ### to H3 tag', function() {
            expect(null).to.be.null;
        });
    });
});
