function testLoader(content, sourceMap) {
  const result = { css: content };

  if (sourceMap) {
    result.map = sourceMap;
  }

  return `module.exports = ${JSON.stringify(result)}`;
}

module.exports = testLoader;
