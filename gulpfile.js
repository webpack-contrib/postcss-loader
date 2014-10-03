var gulp = require('gulp');

gulp.task('lint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src(['index.js', 'test/*.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['lint']);
