var warning = false;

module.exports = function (options) {
    var alpha = options.alpha || '1.0';

    return {
        postcss: function (css, result) {
            if (!warning) {
                result.warn('Test red warning');
                warning = true;
            }

            css.walkDecls(function (decl) {
                if (decl.value === 'blue') {
                    decl.value = 'rgba(255, 0, 0, ' + alpha + ')';
                }
            });
        }
    };
};
