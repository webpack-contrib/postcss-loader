// TODO
test.skip('Syntax Error', () => {
  const css = require('../fixtures/style.css')
  expect(css).toContain(/ERROR: Module build failed/)
})
