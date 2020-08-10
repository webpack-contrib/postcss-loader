import normalizeMap from './normalizeMap';

export default (id, stats) => {
  const { modules } = stats.compilation;
  const module = modules.find((m) => m.id.endsWith(id));
  const { _source } = module;

  // eslint-disable-next-line no-underscore-dangle
  const code = (_source._value || _source._valueAsString).replace(
    'module.exports = ',
    ''
  );

  let result;

  try {
    result = JSON.parse(code);
  } catch (error) {
    result = { css: code };
  }

  const { css, map } = result;

  return { css, map: normalizeMap(map) };
};
