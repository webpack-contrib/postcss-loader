test('Maps', () => {
  const css = require('../fixtures/style.css')
  expect(css).toContain('/*# sourceMappingURL=')
})
