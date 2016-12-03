describe('explicit plugins', function () {

    it('processes CSS with custom plugins', function () {
        var css = require('!raw-loader!../!' +
                          './cases/style.css');
        expect(css).toEqual('a { color: rgba(255, 0, 0, 0.1) }\n');
    });

});
