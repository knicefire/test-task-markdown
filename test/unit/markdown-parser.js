var sinon = require('sinon');
var expect = require('chai').expect;

var parser = require('../../lib/markdown-parser');

/**
 * TODO: remove ids from header
 */
var test = function(input, output) {
    var result = parser(input);
    expect(result).to.equal(output + '\n');
};

describe('Markdown Parser', function() {
    describe('Header', function() {
        describe('Common cases', function() {
            it('should convert # to H1 tag', function() {
                test(
                    '# Hello there',
                    '<h1>Hello there</h1>');
            });

            it('should convert ## to H2 tag', function() {
                test(
                    '## Hello there',
                    '<h2>Hello there</h2>');
            });

            it('should convert ### to H3 tag', function() {
                test(
                    '### Hello there',
                    '<h3>Hello there</h3>');
            });

            it('should convert ### to H4 tag', function() {
                test(
                    '#### Hello there',
                    '<h4>Hello there</h4>');
            });

            it('should convert ### to H5 tag', function() {
                test(
                    '##### Hello there',
                    '<h5>Hello there</h5>');
            });

            it('should convert ### to H6 tag', function() {
                test(
                    '###### Hello there',
                    '<h6>Hello there</h6>');
            });

            it('should ignore trailing #', function() {
                test(
                    '## Hello there ##',
                    '<h2>Hello there</h2>');
            });
        });

        describe('Mixed cases', function() {
            it('should render header and paragraph', function() {
                test(
                    '## Hello there\nAnd there',
                    '<h2>Hello there</h2>\n<p>And there</p>');
            });

            it('should render header and emphasize word', function() {
                test(
                    '## Hello *there*',
                    '<h2>Hello <em>there</em></h2>');
            });

            it('should render header and strong word', function() {
                test(
                    '## Hello **there**',
                    '<h2>Hello <strong>there</strong></h2>');
            });

            it('should render header and emphasize and strong word', function() {
                test(
                    '## *Hello* **there**',
                    '<h2><em>Hello</em> <strong>there</strong></h2>');
            });

            it('should render header and emphasize and strong words that overlaps', function() {
                test(
                    '## *Hello everyone out **there***',
                    '<h2><em>Hello everyone out <strong>there</strong></em></h2>');
            });

            it('should render header and link', function() {
                test(
                    '## Hello [here](http://example.com)',
                    '<h2>here</a></h2>');
            });
        });
    });

    describe('Paragraph', function() {
        describe('Common cases', function() {
            it('should convert simple line into paragraph tag', function() {
                test(
                    'Hello there',
                    '<p>Hello there</p>');
            });

            it('should convert multiline into one paragraph tag', function() {
                test(
                    'Hello there\nAnd there',
                    '<p>Hello there\nAnd there</p>');
            });
        });

        describe('Mixed cases', function() {
            it('should render paragraph and empasize word', function() {
                test(
                    'Hello *there*',
                    '<p>Hello <em>there</em></p>');
            });

            it('should render paragraph and strong word', function() {
                test(
                    'Hello **there**',
                    '<p>Hello <strong>there</strong></p>');
            });

            it('should render paragraph and link', function() {
                test(
                    'Hello [there](http://example.com)',
                    '<p>Hello <a href="http://example.com">there</a></p>');
            });
        });
    });

    describe('Emphasize', function() {
        describe('Common cases', function() {
            it('should emphasize line', function() {
                test(
                    '*Hello there*',
                    '<p><em>Hello there</em></p>');
            });

            it('should emphasize multiline', function() {
                test(
                    '*Hello there\nAnd there*',
                    '<p><em>Hello there\nAnd there</em></p>');
            });

            it('should empasize several words in line', function() {
                test(
                    '*Hello there* but not *here*',
                    '<p><em>Hello there</em> but not <em>here</em></p>');
            });

            it('should empasize several words in multiline', function() {
                test(
                    '*Hello there* but\nnot *here*',
                    '<p><em>Hello there</em> but\nnot <em>here</em></p>');
            });

            it('should properly handle nesting emphases', function() {
                test(
                    '*Hello there *but* not here*',
                    '<p><em>Hello there </em>but<em> not here</em></p>');
            });
        });

        describe('Mixed cases', function() {
            it('should empasize words within strong', function() {
                test(
                    '**Hello *here***',
                    '<p><strong>Hello <em>here</em></strong></p>');
            });

            it('should empasize and strong the whole line', function() {
                test(
                    '***Hello everyone***',
                    '<p><strong><em>Hello everyone</em></strong></p>');
            });

            it('should empasize word within paragraph', function() {
                test(
                    'Hello *here* everyone',
                    '<p>Hello <em>here</em> everyone</p>');
            });
        });
    });

    describe('Strong', function() {
        describe('Common cases', function() {
            it('should make line strong', function() {
                test(
                    '**Hello there**',
                    '<p><strong>Hello there</strong></p>');
            });

            it('should make multiline strong', function() {
                test(
                    '**Hello there\nAnd there**',
                    '<p><strong>Hello there\nAnd there</strong></p>');
            });

            it('should strong several words in line', function() {
                test(
                    '**Hello there** but not **here**',
                    '<p><strong>Hello there</strong> but not <strong>here</strong></p>');
            });

            it('should strong several words in multiline', function() {
                test(
                    '**Hello there** but\nnot **here**',
                    '<p><strong>Hello there</strong> but\nnot <strong>here</strong></p>');
            });

            it('should properly handle nesting strongs', function() {
                test(
                    '**Hello there **but** not here**',
                    '<p><strong>Hello there </strong>but<strong> not here</strong></p>');
            });
        });

        describe('Mixed cases', function() {
            it('should render strong within empasized words', function() {
                test(
                    '*Hello **here***',
                    '<p><em>Hello <strong>here</strong></em></p>');
            });

            it('should strong words within paragraph', function() {
                test(
                    'Hello **here** everyone',
                    '<p>Hello <strong>here</strong> everyone</p>');
            });
        });
    });

    describe('Link', function() {
        describe('Common cases', function() {
            it('should convert line into link', function() {
                test(
                    '[Link to a site](http://example.com)',
                    '<p><a href="http://example.com">Link to a site</a></p>');
            });
        });

        describe('Mixed cases', function() {
            it('should render link in header', function() {
                test(
                    '## [Link to a site](http://example.com)',
                    '<h2>Link to a site</a></h2>');
            });

            it('should convert line into link and emphasize word', function() {
                test(
                    '[Link to a *site*](http://example.com)',
                    '<p><a href="http://example.com">Link to a <em>site</em></a></p>');
            });

            it('should convert line into link and strong word', function() {
                test(
                    '[Link to a **site**](http://example.com)',
                    '<p><a href="http://example.com">Link to a <strong>site</strong></a></p>');
            });

            it('should convert line into link and emphasize and strong word', function() {
                test(
                    '[Link *to* a **site**](http://example.com)',
                    '<p><a href="http://example.com">Link <em>to</em> a <strong>site</strong></a></p>');
            });

            it('should render link within strong', function() {
                test(
                    '**[Link to a site](http://example.com)**',
                    '<p><strong><a href="http://example.com">Link to a site</a></strong></p>');
            });

            it('should render link within emphasis', function() {
                test(
                    '*[Link to a site](http://example.com)*',
                    '<p><em><a href="http://example.com">Link to a site</a></em></p>');
            });
        });
    });
});
