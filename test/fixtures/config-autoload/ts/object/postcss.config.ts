import type { Config as PostCSSConfig } from 'postcss-load-config';
import { Configuration as WebpackConfig } from 'webpack';

const config = function (api: WebpackConfig): PostCSSConfig {
  return {
    parser: 'sugarss',
    syntax: 'sugarss',
    map: api.mode === 'development' ? 'inline' : false,
    from: './test/fixtures/config-autoload/js/object/index.css',
    to: './test/fixtures/config-autoload/js/object/expect/index.css',
    plugins: {
      'postcss-import': {},
      'postcss-nested': {},
    }
  }
};

export default config;
