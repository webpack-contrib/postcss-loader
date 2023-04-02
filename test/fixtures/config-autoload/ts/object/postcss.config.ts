import type { Config } from 'postcss-load-config';

const config = function (api: Config) {
  return {
    parser: 'sugarss',
    syntax: 'sugarss',
    // FIXME: To confirm. Apparently there's no longer an available option `mode`?
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
