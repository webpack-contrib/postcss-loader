import webpack from 'webpack';

import normalizeMap from './normalizeMap';

const isWebpack5 = webpack.version[0] === '5';

export default (id, stats) => {
  const { modules } = stats.compilation;
  const module = modules.find((m) => m.id.endsWith(id));
  const { _source } = module;

  return {
    // eslint-disable-next-line no-underscore-dangle
    css: _source._value || _source._valueAsString,
    map: isWebpack5
      ? // eslint-disable-next-line no-underscore-dangle
        normalizeMap(_source._sourceMapAsObject)
      : // eslint-disable-next-line no-underscore-dangle
        normalizeMap(_source._sourceMap),
  };
};
