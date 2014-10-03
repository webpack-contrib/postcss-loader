require('should');

describe('postcss-loader', function() {

    it('processes CSS', function () {
        var css = require('!raw-loader!../!./cases/style.css');
        css.should.containEql('a { color: blue }');
    });

    it('processes CSS in safe mode', function () {
        var css = require('!raw-loader!../?safe=1!./cases/broken.css');
        css.should.containEql('a { color: blue}');
    });

});
