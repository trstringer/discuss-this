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

setInterval(setNextQuestion, interval);