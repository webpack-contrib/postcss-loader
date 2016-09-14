function RewritePlugin() {

}

RewritePlugin.prototype.apply = function (compiler) {
    function rewrite(postcssPlugins, loaderParams) {
        // Just for the demo and test we remove all plugins if
        // the 'rewrite' parameter is set
        if (loaderParams.rewrite) {
            return [];
        }
        // If the rewrite parameter isn't set we don't change the modules
        return postcssPlugins;
    }

    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('postcss-loader-before-processing', rewrite);
    });
};

module.exports = RewritePlugin;
