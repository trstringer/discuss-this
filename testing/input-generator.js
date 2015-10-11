var http = require('http');
var querystring = require('querystring');
var words = ["blue", "green", "yellow", "red", "purple", "pink", "lion", "horse", "shark", "dolphin"];

function getRandomWord() {
    return words[Math.floor(Math.random(0, words.length) * words.length)];
}
function getMetaString() {
    return (new Date()).getTime();
}
function getRandomAnswer() {
    var answer = "ANS " + getMetaString();
    while (answer.length < 40) {
        answer += " " + getRandomWord();
    }
    return answer + ".";
}
function getRandomQuestion() {
    var question = "QST " + getMetaString();
    while (question.length < 40) {
        question += " " + getRandomWord();
    }
    return question + "?";
}

setInterval(function () {
    addNextQuestion();
}, 1000);

setTimeout(function() {
    setInterval(function () {
        addAnswer();
    }, 1000);
}, 500);

function addAnswer() {
    var answerText = JSON.stringify({
        answerText: getRandomAnswer()
    });
    
    var req = http.request(
        {
            host: 'localhost',
            path: '/questions/answers',
            port: 3000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': answerText.length
            }
        }
    );
    
    req.on('error', function (ex) {
        console.log('request error: ' + ex.message);
    });
    
    req.write(answerText);
    req.end();
}

function addNextQuestion() {
    var questionText = JSON.stringify({
        questionText: getRandomQuestion()
    });
    
    var req = http.request(
        {
            host: 'localhost',
            path: '/questions/next',
            port: 3000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': questionText.length
            }
        }
    );
    
    req.on('error', function (ex) {
        console.log('request error: ' + ex.message);
    });
    
    req.write(questionText);
    req.end();
}