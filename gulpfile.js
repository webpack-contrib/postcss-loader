var gulp = require('gulp');
var path = require('path');
var fs   = require('fs-extra');

var BUILD_CONFIGS = fs.readdirSync(path.join(__dirname, 'test'))
                      .filter(function (file) {
                          return file.indexOf('.config.') !== -1;
                      }).map(function (file) {
                          return file.replace('.config.js', '');
                      });

gulp.task('clean', function (done) {
    fs.remove(path.join(__dirname, 'build'), done);
});

gulp.task('lint', function () {
    if ( parseInt(process.versions.node) < 4 ) {
        return false;
    }
    var eslint = require('gulp-eslint');
    return gulp.src(['index.js', 'test/**/*.js', '*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

BUILD_CONFIGS.forEach(function (config) {
    gulp.task(config, ['clean'], function () {
        var webpack = require('webpack-stream');
        var file = path.join(__dirname, 'test', config + '.config.js');
        return gulp.src('')
          .pipe(webpack(require(file)))
          .pipe(gulp.dest('build/'));
    });
});

gulp.task('build', BUILD_CONFIGS);

gulp.task('test', ['build'], function () {
    var mocha = require('gulp-mocha');
    return gulp.src('build/*.js', { read: false }).pipe(mocha());
});

gulp.task('default', ['lint', 'test']);
