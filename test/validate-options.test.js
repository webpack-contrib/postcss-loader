/* eslint-disable global-require */
import path from 'path';

import { getCompiler, compile } from './helpers/index';

describe('validate options', () => {
  const tests = {
    config: {
      success: [
        { path: 'test/fixtures/config-scope/config/postcss.config.js' },
        {
          path: 'test/fixtures/config-scope/config/postcss.config.js',
          ctx: { plugin: true },
        },
        true,
        false,
        'test/fixtures/config-scope/config/postcss.config.js',
      ],
      failure: [[], { foo: 'bar' }],
    },
    exec: {
      success: [false],
      failure: [1, 'test', /test/, [], {}, { foo: 'bar' }],
    },
    parser: {
      success: ['sugarss', require('sugarss'), require('sugarss').parse],
      failure: [1, true, false, []],
    },
    syntax: {
      success: ['sugarss', require('sugarss')],
      failure: [1, true, false, []],
    },
    stringifier: {
      success: ['sugarss', require('sugarss'), require('sugarss').stringify],
      failure: [1, true, false, []],
    },
    sourceMap: {
      success: ['source-map', true],
      failure: [1, /test/, [], {}],
    },
    plugins: {
      success: [
        [require('./fixtures/config-scope/config/plugin')()],
        require('./fixtures/config-scope/config/plugin'),
        () => [require('./fixtures/config-scope/config/plugin')()],
        [['postcss-short', false]],
        [['postcss-short', { prefix: 'x' }]],
        ['postcss-short'],
      ],
      failure: [1, true, false],
    },
  };

  function stringifyValue(value) {
    if (
      Array.isArray(value) ||
      (value && typeof value === 'object' && value.constructor === Object)
    ) {
      return JSON.stringify(value);
    }

    return value;
  }

  async function createTestCase(key, value, type) {
    it(`should ${
      type === 'success' ? 'successfully validate' : 'throw an error on'
    } the "${key}" option with "${stringifyValue(value)}" value`, async () => {
      let compiler;

      if (key === 'parser' || key === 'syntax') {
        compiler = getCompiler(
          './sss/index.js',
          {},
          {
            module: {
              rules: [
                {
                  test: /\.sss$/i,
                  use: [
                    {
                      loader: require.resolve('./helpers/testLoader'),
                      options: {},
                    },
                    {
                      loader: path.resolve(__dirname, '../src'),
                      options: { [key]: value },
                    },
                  ],
                },
              ],
            },
          }
        );
      } else {
        compiler = getCompiler('./css/index.js', { [key]: value });
      }

      let stats;

      try {
        stats = await compile(compiler);
      } finally {
        if (type === 'success') {
          expect(stats.hasErrors()).toBe(false);
        } else if (type === 'failure') {
          const {
            compilation: { errors },
          } = stats;

          expect(errors).toHaveLength(1);
          expect(() => {
            throw new Error(errors[0].error.message);
          }).toThrowErrorMatchingSnapshot();
        }
      }
    });
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values)) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
