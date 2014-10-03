var gulp = require('gulp');

gulp.task('clean', function (done) {
    var fs = require('fs-extra');
    fs.remove(__dirname + '/build', done);
});

gulp.task('lint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src(['index.js', 'test/*.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('build', ['clean'], function () {
    var webpack = require('gulp-webpack');
    return gulp.src('')
        .pipe(webpack(require('./test/webpack.config')))
        .pipe(gulp.dest('build/'));
});

gulp.task('test', ['build'], function () {
    var mocha = require('gulp-mocha');
    return gulp.src('build/*.js', { read: false }).pipe(mocha());
});

gulp.task('default', ['lint', 'test']);
