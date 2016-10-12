var expect = require('chai').expect;

describe('custom parser', function () {

    it('processes sugarss', function () {
        var css = require('!raw-loader!../!' +
                          './support/cases/sugar.css');
        expect(css).to.eql('a\n  color: rgba(255, 0, 0, 0.1)\n');
    });

});
