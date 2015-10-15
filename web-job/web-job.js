/*
 * this is the web job that routinely does a few things
 * 1. recycles the question (sets the new question)
 * 2. tweets the question
 * 
 * the current duration is 7 minutes
 * 
 * currently there is no auth logic to restrict API calls 
 * to set the next question. this will be implemented soon
 */

var http = require('http');
var exec = require('child_process').exec;

var interval = 7 * 60 * 1000;

function setNextQuestion() {
    var req = http.request(
        {
            host: 'localhost',
            path: '/questions/gen',
            port: 3000,
            method: 'POST'
        }
    );
    req.on('error', function (ex) {
        console.log('request error: ' + ex.message);
    });
    
    req.end();
}

// set the dateAsked of the current question to the now time
//
exec('mongo ..\\data\\mongo-set-current-question-dateAsked.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    
    console.log('current date: ' + (new Date()).toLocaleString());
    setInterval(setNextQuestion, interval);
});