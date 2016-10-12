var expect = require('chai').expect;

describe('default', function () {

    it('processes CSS with default plugins', function () {
        var css = require('!raw-loader!../!./support/cases/style.css');
        expect(css).to.eql('a { color: blue }\n');
    });

    it('processes CSS in safe mode', function () {
        var css = require('!raw-loader!' +
                          '../?parser=postcss-safe-parser!' +
                          './support/cases/broken.css');
        expect(css).to.eql('a { color:\n}');
    });

    it('lets other plugins alter the used plugins', function () {
        var css = require('!raw-loader!../?rewrite=true!' +
                          './support/cases/style.css');
        expect(css).to.eql('a { color: black }\n');
    });

    it('processes CSS-in-JS', function () {
        var css = require('!raw-loader!' +
                          '../?parser=postcss-js!' +
                          './support/cases/style.js');
        expect(css).to.eql('a {\n    color: blue\n}');
    });

    it('processes CSS with exec', function () {
        var css = require('!raw-loader!' +
                          '../?exec!' +
                          './support/cases/exec.js');
        expect(css).to.eql('a {\n    color: green\n}');
    });

    it('inlines map', function () {
        var css = require('!raw-loader!../?sourceMap=inline!' +
                          './support/cases/style.css');
        expect(css).to.include('/*# sourceMappingURL=');
    });

});
