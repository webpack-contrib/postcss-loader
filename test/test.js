var expect = require('chai').expect;

describe('postcss-loader', function () {

    it('processes CSS with default plugins', function () {
        var css = require('!raw-loader!../!./cases/style.css');
        expect(css).to.eql('a { color: red }\n');
    });

    it('processes CSS with custom plugins', function () {
        var css = require('!raw-loader!../?pack=blues!./cases/style.css');
        expect(css).to.eql('a { color: blue }\n');
    });

    it('prints syntax errors without JS stacktrace', function () {
        require('!raw-loader!../!./cases/broken.css');
    });

    it('processes CSS in safe mode', function () {
        var css = require('!raw-loader!' +
                          '../?parser=postcss-safe-parser!' +
                          './cases/broken.css');
        expect(css).to.eql('a { one color: red }\n');
    });

    it('processes CSS-in-JS', function () {
        var css = require('!raw-loader!' +
                          '../?parser=postcss-js!' +
                          './cases/style.js');
        expect(css).to.eql('a {\n    color: red\n}');
    });

});
