var expect = require('chai').expect;

describe('postcss-loader', function () {

    context('when config defines syntax function', function () {
        it('processes sugarss', function () {
            var css = require('!raw-loader!../!' +
                              './support/cases/sugar.css');
            expect(css).to.eql('a\n  color: rgba(255, 0, 0, 0.1)\n');
        });
    });
});
