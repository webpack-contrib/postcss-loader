export default (map) => {
  if (typeof map === 'undefined') {
    // eslint-disable-next-line no-undefined
    return undefined;
  }

  const result = map;

  if (result.sources) {
    const replacedArray = new Array(result.sources.length);

    result.sources = replacedArray.fill('xxx');
  }

  if (result.file) {
    [result.file] = 'x';
  }

  if (result.sourceRoot) {
    [result.sourceRoot] = 'x';
  } else {
    delete result.sourceRoot;
  }

  return result;
};
