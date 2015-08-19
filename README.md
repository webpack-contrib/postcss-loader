# PostCSS for Webpack [![Build Status][ci-img]][ci]

<img align="right" width="95" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="http://postcss.github.io/postcss/logo.svg">

[PostCSS] loader for [webpack] to postprocesses your CSS with [PostCSS plugins].

<a href="https://evilmartians.com/?utm_source=postcss-loader">
<img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" alt="Sponsored by Evil Martians" width="236" height="54">
</a>

[PostCSS plugins]: https://github.com/postcss/postcss#plugins
[PostCSS]:         https://github.com/postcss/postcss
[webpack]:         http://webpack.github.io/
[ci-img]:          https://travis-ci.org/postcss/postcss-loader.svg
[ci]:              https://travis-ci.org/postcss/postcss-loader

## Usage

Set `postcss` section in webpack config:

```js
var autoprefixer = require('autoprefixer');
var cssnext      = require('cssnext');

module.exports = {
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function () {
        return [autoprefixer, cssnext];
    }
}
```

Now your CSS files requirements will be processed by selected PostCSS plugins:

```js
var css = require('./file.css');
// => CSS after Autoprefixer and CSSWring
```

Note that the context of this function

```js
module.exports = {
    ...
    postcss: function () {
        return [autoprefixer, cssnext];
    }
}
```

will be set to the [webpack loader-context].
If there is the need, this will let you access to webpack loaders API.

[webpack loader-context]: http://webpack.github.io/docs/loaders.html#loader-context

## Plugins Packs

If you want to process different styles by different PostCSS plugins you can
define plugin packs in `postcss` section and use them by `?pack=name` parameter.

```js
module.exports = {
    module: {
        loaders: [
            {
                test:   /\.docs\.css$/,
                loader: "style-loader!css-loader!postcss-loader?pack=cleaner"
            },
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function () {
        return {
            defaults: [autoprefixer, cssnext],
            cleaner:  [autoprefixer({ browsers: [] })]
        };
    }
}
```

## Integration with postcss-import

When using [postcss-import] plugin, you may want to tell webpack about
dependencies coming from your `@import` directives.
For example: in watch mode, to enable recompile on change.

Since the function in postcss section is executed with
the [webpack loader-context], we can use the postcss-import callback
[onImport] to tell webpack what files need to be watched.

```js
var cssimport = require('postcss-import');
var autoprefixer = require('autoprefixer-core');

module.exports = {
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function () {
        // The context of this function is the webpack loader-context
        // see: http://webpack.github.io/docs/loaders.html#loader-context

        return [
            cssimport({
                // see postcss-import docs to learn about onImport callback
                // https://github.com/postcss/postcss-import

                onImport: function (files) {
                    files.forEach(this.addDependency);
                }.bind(this)
            }),
            autoprefixer
        ];
    }
}
```

[webpack loader-context]: http://webpack.github.io/docs/loaders.html#loader-context
[postcss-import]:         https://github.com/postcss/postcss-import
[onImport]:               https://github.com/postcss/postcss-import#onimport

## Custom Syntaxes

PostCSS can transforms styles in any syntax, not only in CSS.
There are 3 parameters to control syntax:

* `syntax` accepts module name with `parse` and `stringify` function.
* `parser` accepts module name with input parser function.
* `stringifier` accepts module name with output stringifier function.

For example, you can use [Safe Parser] to find and fix any CSS errors:

```js
var css = require('postcss?parser=postcss-safe-parser!./broken')
```

[Safe Parser]: https://github.com/postcss/postcss-safe-parser
