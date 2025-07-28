export default (id, stats) => {
  const { modules } = stats.compilation;
  const module = modules.find((m) => m.id.endsWith(id));
  const { _source } = module;

  const code = (_source._value || _source._valueAsString).replace(
    "module.exports = ",
    "",
  );

  let result;

  try {
    result = JSON.parse(code);
  } catch {
    result = { css: code };
  }

  const { css, map: sourceMap } = result;

  return { css, sourceMap };
};
