module.exports = function (css) {
    css.walkDecls(function (decl) {
        if ( decl.value === 'black' ) decl.value = 'blue';
    });
};
