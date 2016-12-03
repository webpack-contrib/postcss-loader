describe('custom parser', function () {

    it('processes sugarss', function () {
        var css = require('!raw-loader!../!' +
                          './cases/sugar.css');
        expect(css).toEqual('a\n  color: rgba(255, 0, 0, 0.1)\n');
    });

});
