require('should');

describe('postcss-loader', function() {

    it('processes CSS with default plugins', function () {
        var css = require('!raw-loader!../!./cases/style.css');
        css.should.containEql('a { color: red }');
    });

    it('processes CSS with custom plugins', function () {
        var css = require('!raw-loader!../?pack=blues!./cases/style.css');
        css.should.containEql('a { color: blue }');
    });

    it('processes CSS in safe mode', function () {
        var css = require('!raw-loader!../?safe=1!./cases/broken.css');
        css.should.containEql('a { color: red}');
    });

});
