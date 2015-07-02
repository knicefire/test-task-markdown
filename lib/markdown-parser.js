var marked = require('marked');

function Parser() {
    this.regs = {
        paragraph: '', // fallback method
        header: '', // should match any fist # up to the newline. figure level later
        em: '', // should be run after strong
        strong: '', // should match anything
        link: ''
    };
}

Parser.prototype = {
    parse: {

    },

    compile: {
        paragraph: function(text) {
            return '<p>' + text + '</p>';
        },

        header: function(text, level) {
            return '<h' + level + '>' + text + '</h' + level + '>';
        },

        em: function(text) {
            return '<em>' + text + '</em>';
        },

        strong: function(text) {
            return '<strong>' + text + '</strong>';
        },

        link: function(text, url) {
            return '<a href="' + url + '">' + text + '</a>';
        }
    }
};

/**
 * Parsing algorithm:
 * - Split the whole text into blocks based on potential headers
 * - Process each block separately
 * 	- Process first line as header
 * 	- Process what has left as a block.
 * 		Proirity
 * 	 		link
 * 	 		strong
 * 	 		em
 * 	 	wrap it up with paragraph
 */
module.exports = function(text) {
    // TODO: implement your own parser
    return marked(text).replace(/\sid=\".*\"/g, '');
};
