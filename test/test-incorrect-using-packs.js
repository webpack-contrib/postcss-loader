var expect = require('chai').expect;

describe('postcss-loader', function () {

    context('when config does not define packs', function () {
        it('fails to load specific pack', function () {
            var compile = function () {
                // Try-catch to change webpack error into warning
                try {
                    require('!raw-loader!../../?pack=blues!' +
                            '../support/cases/style.css');
                } catch (ex) {
                    // and then propagate runtime error
                    throw ex;
                }
            };

            expect(compile).to.throw('Cannot find module');
        });
    });
});
