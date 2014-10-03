require('should');

describe('postcss-loader', function() {

    it('processes CSS', function () {
        var css = require('!raw-loader!../!./cases/style.css');
        css.should.containEql('color: black');
    });

});
