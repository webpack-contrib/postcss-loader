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
    postcssOptions: {
      success: [
        { parser: 'sugarss' },
        { parser: require('sugarss') },
        { parser: require('sugarss').parse },
        { syntax: 'sugarss' },
        { syntax: require('sugarss') },
        { stringifier: 'sugarss' },
        { stringifier: require('sugarss') },
        { stringifier: require('sugarss').stringify },
        { plugins: () => require('./fixtures/config/plugin')() },
        { plugins: () => [require('./fixtures/config/plugin')()] },
        {
          plugins: [
            require('./fixtures/config/plugin')(),
            require('./fixtures/config/plugin'),
            { 'postcss-short': { prefix: 'x' } },
          ],
        },
        { plugins: { 'postcss-short': { prefix: 'x' } } },
      ],
      failure: [
        { parser: 1 },
        { parser: true },
        { parser: [] },
        { syntax: 1 },
        { syntax: true },
        { syntax: [] },
        { stringifier: 1 },
        { stringifier: true },
        { stringifier: [] },
        { plugins: 1 },
        { plugins: true },
        { plugins: 'postcss-short' },
      ],
    },
    sourceMap: {
      success: ['source-map', true],
      failure: [1, /test/, [], {}],
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

      if (
        key === 'postcssOptions' &&
        // eslint-disable-next-line no-prototype-builtins
        (value.hasOwnProperty('parser') || value.hasOwnProperty('syntax'))
      ) {
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
