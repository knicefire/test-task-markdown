function Parser() {}

Parser.prototype = {
    regs: {
        block: /(#{1,6}.*)/,
        header: /(#{1,6})(.*)/,
        em: /\*{1}((.+?\n?)+?)\*{1}/g,
        strong: /\*{2}((.+?\n?)+?)\*{2}/g,
        link: /\[(.*)\]\((.*)\)/
    },

    /**
     * Main mathod that pareses text
     */
    parse: function(text) {
        // splitting text by blocks
        var blocks = text.split(this.regs.block);

        return blocks.map(function(block) {
            block = block.trim();
            if (!block) return block; // no need to process;

            // process block with parsers
            for (var parser in this.parsers) {
                block = this.parsers[parser].call(this, block);
            }
            return block;

        }, this)
        // filtering out empty results
        .filter(function(item) {
            return !!item;
        })
        // join back and add a new line in the end of the file
        .join('\n') + '\n';
    },

    /**
     * List of parser methods
     * NOTE: in current implementation the declaration order matters
     */
    parsers: {
        link: function(text) {
            return text.replace(this.regs.link, this.compile.link);
        },

        strong: function(text) {
            return text.replace(this.regs.strong, this.compile.strong);
        },

        em: function(text) {
            return text.replace(this.regs.em, this.compile.em);
        },

        paragraph: function(text) {
            // if header matched - no need to wrap it with paragraph
            if (this.regs.header.test(text)) return text;

            return this.compile.paragraph(text);
        },

        header: function(text) {
            return text.replace(this.regs.header, this.compile.header);
        }
    },

    compile: {
        paragraph: function(text) {
            return '<p>' + text + '</p>';
        },

        header: function(text, level) {
            level = level.length;
            text = text.replace(/#/g, '').trim();
            return '<h' + level + '>' + text + '</h' + level + '>';
        },

        em: '<em>$1</em>',

        strong: '<strong>$1</strong>',

        link: '<a href="$2">$1</a>'
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
    var p = new Parser();
    return p.parse(text);
};
