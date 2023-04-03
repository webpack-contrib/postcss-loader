import type { Config as PostCSSConfig } from 'postcss-load-config';
import type { LoaderContext } from 'webpack';

type PostCSSLoaderContext = LoaderContext<PostCSSConfig>;

interface PostCSSLoaderAPI {
    mode: PostCSSLoaderContext['mode'];
    file: PostCSSLoaderContext['resourcePath'];
    webpackLoaderContext: PostCSSLoaderContext;
    env: PostCSSLoaderContext['mode'];
    options: PostCSSConfig;
}

type PostCSSLoaderOptions = PostCSSConfig | ((api: PostCSSLoaderAPI) => PostCSSConfig);

const config: PostCSSLoaderOptions = function (api) {
  return {
    parser: 'sugarss',
    syntax: 'sugarss',
    map: api.mode === 'development' ? 'inline' : false,
    from: './test/fixtures/config-autoload/js/object/index.css',
    to: './test/fixtures/config-autoload/js/object/expect/index.css',
    plugins: [
      'postcss-import',
      [
        'postcss-nested',
        {
          // Options
        }
      ],
      require('postcss-nested'),
      require('postcss-nested')({ /* Options */ }),
    ]
  }
};

module.exports = config;
