var expect = require('chai').expect;

describe('default', function () {

    it('processes CSS with default plugins', function () {
        var css = require('!raw-loader!../!./cases/style.css');
        expect(css).to.eql('a { color: blue }\n');
    });

    it('overrides default config by subdir config', function () {
        var css = require('!raw-loader!../!./cases/config/style.css');
        expect(css).to.eql('a { color: black }\n');
    });

    it('send webpack instance to config', function () {
        var css = require('!raw-loader!../!./cases/env/style.css');
        expect(css).to.eql('a::before { content: "style.css" }\n');
    });

    it('processes CSS in safe mode', function () {
        var css = require('!raw-loader' +
                          '!../?parser=postcss-safe-parser' +
                          '!./cases/broken.css');
        expect(css).to.eql('a { color:\n}');
    });

    it('lets other plugins alter the used plugins', function () {
        var css = require('!raw-loader!../?rewrite=true' +
                          '!./cases/style.css');
        expect(css).to.eql('a { color: black }\n');
    });

    it('processes CSS-in-JS', function () {
        var css = require('!raw-loader' +
                          '!../?parser=postcss-js' +
                          '!./cases/style.js');
        expect(css).to.eql('a {\n    color: blue\n}');
    });

    it('processes CSS with exec', function () {
        var css = require('!raw-loader' +
                          '!../?exec' +
                          '!./cases/exec.js');
        expect(css).to.eql('a {\n    color: green\n}');
    });

    it('inlines map', function () {
        var css = require('!raw-loader!../?sourceMap=inline' +
                          '!./cases/style.css');
        expect(css).to.include('/*# sourceMappingURL=');
    });

    it('allows to change config path', function () {
        var css = require('!raw-loader' +
                          '!../?config=test/cases/config/postcss.config.js' +
                          '!./cases/style.css');
        expect(css).to.eql('a { color: black }\n');
    });

});
