module.exports = {
    target: 'node',
    context: __dirname,
    entry: './test.js',
    output: {
        path: __dirname + '/../build/',
        filename: "test.js",
    }
};
