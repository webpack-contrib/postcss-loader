var path = require('path');

module.exports = function (ctx) {
    var plugin = function (css) {
        css.walkDecls('content', function (decl) {
            decl.value = '"' + path.basename(ctx.webpack.resourcePath) + '"';
        });
    };
    return {
        plugins: [plugin]
    };
};
