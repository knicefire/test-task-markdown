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
                '# Hello there',
                '<h1 id="hello-there">Hello there</h1>');
        });

        it('should convert ## to H2 tag', function() {
            test(
                '## Hello there',
                '<h2 id="hello-there">Hello there</h2>');
        });

        it('should convert ### to H3 tag', function() {
            test(
                '### Hello there',
                '<h3 id="hello-there">Hello there</h3>');
        });

        it('should convert ### to H4 tag', function() {
            test(
                '#### Hello there',
                '<h4 id="hello-there">Hello there</h4>');
        });

        it('should convert ### to H5 tag', function() {
            test(
                '##### Hello there',
                '<h5 id="hello-there">Hello there</h5>');
        });

        it('should convert ### to H6 tag', function() {
            test(
                '###### Hello there',
                '<h6 id="hello-there">Hello there</h6>');
        });
    });

    describe('Paragraph parser', function() {
        it('should convert simple line into paragraph tag', function() {
            test(
                '# Hello there',
                '<h1 id="hello-there">Hello there</h1>');
        });

        it('should convert multiline into one paragraph tag', function() {
        });
    });

    describe('Emphasize parser', function() {
        it('should emphasize line', function() {

        });

        it('should emphasize multiline', function() {

        });
    });

    describe('Strong parser', function() {
        it('should make line strong', function() {

        });

        it('should make multiline strong', function() {

        });
    });

    describe('Link parser', function() {
        it('should convert line into link', function() {

        });
    });

    // Mixed cases
    describe('Emphasize within Header', function() {
        it('should emphasize paragraph', function() {

        });
    });

    describe('Emphasize within Paragraph', function() {
        it('should emphasize paragraph', function() {

        });
    });

    describe('Strong within Header', function() {
        it('should emphasize paragraph', function() {

        });
    });

    describe('Strong within Paragraph', function() {
        it('should emphasize paragraph', function() {

        });
    });

    describe('Emphasize and Strong', function() {
        it('should empasize and strong line', function() {

        });
    });

    describe('Emphasize link', function() {
        it('should empasize link', function() {

        });
    });

    describe('Strong link', function() {
        it('should strong link', function() {

        });
    });

    describe('Header link', function() {
        it('should support links in header', function() {

        });
    });
});
