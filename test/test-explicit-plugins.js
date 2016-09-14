var expect = require('chai').expect;

describe('postcss-loader', function () {

    context('when config adds plugins', function () {
        it('processes CSS with custom plugins', function () {
            var css = require('!raw-loader!../!' +
                              './support/cases/style.css');
            expect(css).to.eql('a { color: rgba(255, 0, 0, 0.1) }\n');
        });
    });
});
