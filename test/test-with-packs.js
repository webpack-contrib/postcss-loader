describe('with packs', function () {

    it('processes CSS with default plugins', function () {
        var css = require('!raw-loader!../!' +
                          './cases/style.css');
        expect(css).toEqual('a { color: rgba(255, 0, 0, 0.1) }\n');
    });

    it('processes CSS with custom plugins', function () {
        var css = require('!raw-loader!../?pack=blues!' +
                          './cases/style.css');
        expect(css).toEqual('a { color: blue }\n');
    });

});
