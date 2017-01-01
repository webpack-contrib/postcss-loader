describe('custom parser', function () {

    it('processes sugarss', function () {
        var css = require('!raw-loader!../?parser=sugarss!' +
                          './cases/sugar.sss');
        expect(css).toEqual('a {\n  color: blue\n}\n');
    });

});
