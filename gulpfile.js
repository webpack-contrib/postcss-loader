var gulp = require('gulp');
var path = require('path');

var BUILD_CONFIGS = [
    './test/webpack-default.config',
    './test/webpack-explicit-plugins.config',
    './test/webpack-with-packs.config',
    './test/webpack-incorrect-using-packs.config',
    './test/webpack-custom-parser.config'
];

gulp.task('clean', function (done) {
    var fs = require('fs-extra');
    fs.remove(path.join(__dirname, 'build'), done);
});

gulp.task('lint', function () {
    if ( parseInt(process.versions.node) < 4 ) {
        return false;
    }
    var eslint = require('gulp-eslint');
    return gulp.src(['index.js', 'test/**/*.js', 'gulpfile.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

BUILD_CONFIGS
    .forEach(function (configFile) {
        gulp.task(configFile, ['clean'], function () {
            var webpack = require('webpack-stream');
            return gulp.src('')
              .pipe(webpack(require(configFile)))
              .pipe(gulp.dest('build/'));
        });
    });

gulp.task('build', BUILD_CONFIGS);

gulp.task('test', ['build'], function () {
    var mocha = require('gulp-mocha');
    return gulp.src('build/*.js', { read: false }).pipe(mocha());
});

gulp.task('default', ['lint', 'test']);
