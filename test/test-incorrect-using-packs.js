describe('incorrect using packs', function () {

    it('fails to load specific pack', function () {
        var error;
        try {
            require('!raw-loader!../?pack=blues!' +
                    './cases/style.css');
        } catch (err) {
            error = err;
        }
        expect(error.message).toMatch(/find module/);
    });

});
