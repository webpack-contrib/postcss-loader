test('Source Maps - Inline', () => {
  const css = require('../fixtures/style.css')
  expect(css).toEqual('a { color: black }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0eWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLFlBQVksRUFBRSIsImZpbGUiOiJzdHlsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJhIHsgY29sb3I6IGJsYWNrIH1cbiJdfQ== */')
})
