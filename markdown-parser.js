var marked = require('marked');

module.exports = {
    toHTML: function(text) {
        // TODO: parse markdown here
        return marked(text);
    }
};
