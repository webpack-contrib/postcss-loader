# PostCSS for Webpack [![Build Status](https://travis-ci.org/postcss/postcss-loader.png)](https://travis-ci.org/postcss/postcss-loader)

<img align="right" width="95" height="95" src="http://postcss.github.io/postcss/logo.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS] loader for [webpack] to postprocesses your CSS with [PostCSS plugins].

[PostCSS plugins]: https://github.com/postcss/postcss#built-with-postcss
[PostCSS]:         https://github.com/postcss/postcss
[webpack]:         http://webpack.github.io/

## Usage

Set `postcss` section in webpack config:

```
var autoprefixer = require('autoprefixer-core');
var csswring     = require('csswring');

module.exports = {
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: [autoprefixer, csswring]
}
```

Now your CSS file requirements will be processed by selected PostCSS plugins:

```
var css = require('./file.css');
// => CSS after Autoprefixer and CSSWring
```

## Safe Mode

If you add `?safe=1` to requirement, PostCSS will try to correct any syntax
error that it finds in the CSS. For example, it will parse `a {` as `a {}`.

```
var css = require('postcss?safe=1!./broken')
```

## Plugins Packs

If you want to process different styles by different PostCSS plugins you can
define plugin packs in `postcss` section and use them by `?pack=name` parameter.

```
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
    postcss: {
        default: [autoprefixer, csswring],
        cleaner: [autoprefixer({ browsers: [] })]
    }
}
```
