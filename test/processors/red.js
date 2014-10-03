module.exports = {
    postcss: function (css) {
        css.eachDecl(function (decl) {
            if ( decl.value == 'blue' ) decl.value = 'red';
        });
    }
}
