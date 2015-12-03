var gulp = require('gulp');
var exec = require('child_process').exec;
var minify = require('gulp-minify');

gulp.task('web-job', function (callback) {
    exec('mongo .\\data\\mongo-set-current-question-dateAsked.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});

gulp.task('documentdb-dbg-seed-data', function (callback) {
    exec('node .\\data\\documentdb\\seed-dbg-data.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});

gulp.task('minify', function() {
    gulp.src('public/javascripts/site.js')
        .pipe(minify({}))
        .pipe(gulp.dest('public/javascripts'));
});

gulp.task('build', ['minify']);