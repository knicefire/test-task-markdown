var marked = require('marked');

module.exports = function(text) {
    // TODO: implement your own parser
    return marked(text).replace(/\sid=\".*\"/g, '');
};
