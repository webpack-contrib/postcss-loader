module.exports = function (css) {
    css.eachDecl(function (decl) {
        if ( decl.value == 'black' ) decl.value = 'blue';
    });
}
