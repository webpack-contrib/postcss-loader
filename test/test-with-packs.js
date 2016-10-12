var expect = require('chai').expect;

describe('with packs', function () {

    it('processes CSS with default plugins', function () {
        var css = require('!raw-loader!../!' +
                          './support/cases/style.css');
        expect(css).to.eql('a { color: rgba(255, 0, 0, 0.1) }\n');
    });

    it('processes CSS with custom plugins', function () {
        var css = require('!raw-loader!../?pack=blues!' +
                          './support/cases/style.css');
        expect(css).to.eql('a { color: blue }\n');
    });

});
