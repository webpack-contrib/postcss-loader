[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![build][build]][build-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]

# PostCSS Loader <img width="108" height="108" align="right" src="http://postcss.github.io/postcss/logo.svg">

<a href="https://evilmartians.com/?utm_source=postcss-loader">
<br/>
<img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## Install

```bash
npm i -D postcss-loader
```

## Usage

#### webpack v1

**webpack.config.js**

```js
var precss = require('precss')
var prefixer = require('autoprefixer')

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader'
      }
    ]
  },
  postcss: () => {
      return [precss, prefixer]
  }
}
```

#### webpack v2

**webpack.config.js**

```js
var { LoaderOptionsPlugin } = require('webpack')

var precss = require('precss')
var autoprefixer = require('autoprefixer')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use:  [
          "style-loader",
          {loader: "css-loader", options: { importLoaders: 1 }}
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new LoaderOptionsPlugin({
      options: {
        postcss: () => {
          return [ precss, autoprefixer ]
        }
      }
    })
  ]
}
```

Now your CSS files requirements will be processed by selected PostCSS plugins:

```js
var css = require('./file.css')
```

Note that the context of this function

```js
module.exports = {
  postcss: () => {
    return [ autoprefixer, precss ]
  }
}
```

will be set to the webpack [loader-context].
If there is the need, this will let you access to webpack loaders API.


[loader-context]: http://webpack.github.io/docs/loaders/postcss#loader-context

## Options

#### Packages

If you want to process different styles by different PostCSS plugins you can
define plugin packs in `postcss` section and use them by `?pack=name` parameter.

```js
module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
      {
        test: /\.docs\.css$/,
        loader: "style-loader!css-loader!postcss-loader?pack=docs"
      },
    ]
  },
  postcss: function () {
      return {
        defaults: [ precss, autoprefixer ],
        docs:  [ autoprefixer({ browsers: [] }) ]
    }
  }
}
```

#### Syntaxes

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

If you need to pass the function directly instead of a module name,
you can do so through the webpack postcss option, as such:

```js
var sugarss = require('sugarss')

module.exports = {
  module: {
    loaders: [
      {
        test:   /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: () => {
    return {
        plugins: [autoprefixer, precss],
        syntax: sugarss
    };
  }
}
```

#### SourceMaps

Loader will use source map settings from previous loader.

You can set this `sourceMap` parameter to `inline` value to put source maps
into CSS annotation comment:

```js
module.exports = {
  module: {
    loader: "style-loader!css-loader!postcss-loader?sourceMap=inline"
  }
}
```

## Examples

#### @import

When using [postcss-import] plugin, you may want to tell webpack about
dependencies coming from your `@import` directives.
For example: in watch mode, to enable recompile on change.

Here is a simple way to let know postcss-import to pass files to webpack:

```js
var postcssImport = require('postcss-import')

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: (webpack) => {
    return [ postcssImport({ addDependencyTo: webpack }) ]
  }
}
```

[webpack loader-context]: http://webpack.github.io/docs/loaders/postcss#loader-context
[postcss-import]: https://github.com/postcss/postcss-import

#### [CSS Modules]

`postcss-loader` [cannot be used] with [CSS Modules] out of the box due
to the way `css-loader` processes file imports. To make them work properly,
either add the css-loader’s [`importLoaders`] option

```js
{
  test: /\.css$/,
  loader: [
    "style-loader",
    "css-loader?modules&importLoaders=1",
    "postcss-loader"
  ]
}
```
or use [postcss-modules] plugin instead of `css-loader`.


[`importLoaders`]: https://github.com/webpack/css-loader#importing-and-chained-loaders
[postcss-modules]: https://github.com/outpunk/postcss-modules
[cannot be used]: https://github.com/webpack/css-loader/issues/137
[CSS Modules]: https://github.com/webpack/css-loader#css-modules

#### Syntaxes

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

If you need to pass the function directly instead of a module name,
you can do so through the webpack postcss option, as such:

```js
var sugarss = require('sugarss')

module.exports = {
  module: {
   loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: () => {
    return {
      syntax: sugarss,
      plugins: [ autoprefixer, precss ]
    }
  }
}
```

#### JS Styles

If you want to process styles written in JavaScript
you can use the [postcss-js] parser.

```js
{
  test:   /\.style.js$/,
  loader: "style-loader!css-loader!postcss-loader?parser=postcss-js"
}
```

Or use can use even ES6 in JS styles by Babel:

```js
{
  test:   /\.style.js$/,
  loader: "style-loader!css-loader!postcss-loader?parser=postcss-js!babel"
}
```

As result you will be able to write styles as:

```js
import colors from './config/colors'

export default {
  '.menu': {
    color: colors.main,
    height: 25,
    '&_link': {
      color: 'white'
    }
  }
}
```

If you use JS styles without `postcss-js` parser, you can add `exec` parameter:

```js
{
  test:   /\.style.xyz$/,
  loader: "style-loader!css-loader!postcss-loader?parser=custom-parser&exec"
}
```

#### Webpack Events

Webpack provides webpack-plugin developers a convenient way
to hook into the build pipeline. The postcss-loader makes us
of this event system to allow building integrated postcss-webpack tools.

See the [example] implementation.

* `postcss-loader-before-processing`  
  is fired before processing and allows to add or remove postcss plugins


[example]: https://github.com/postcss/postcss-loader/blob/master/test/webpack-plugins/rewrite.js
[postcss-js]: https://github.com/postcss/postcss-js


[npm]: https://img.shields.io/npm/v/postcss-loader.svg
[npm-url]: https://npmjs.com/package/postcss-loader

[deps]: https://david-dm.org/postcss/postcss-loader.svg
[deps-url]: https://david-dm.org/postcss/postcss-loader

[build]: http://img.shields.io/travis/postcss/postcss-loader.svg?branch=master
[build-url]: https://travis-ci.org/postcss/postcss-loader?branch=master

[cover]: https://coveralls.io/repos/github/postcss/postcss-loader/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/postcss/postcss-loader?branch=master

[chat]: https://img.shields.io/badge/gitter-postcss%2Fpostcss-brightgreen.svg
[chat-url]: https://gitter.im/postcss/postcss
