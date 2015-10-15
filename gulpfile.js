var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('web-job', function (callback) {
    exec('mongo .\\data\\mongo-set-current-question-dateAsked.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});