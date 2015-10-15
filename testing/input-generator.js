var http = require('http');
var querystring = require('querystring');
var words = ["blue", "green", "yellow", "red", "purple", "pink", "lion", "horse", "shark", "dolphin"];
var minVotes = 10;
var maxVotes = 200;

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

function getNextQuestionCandidates(callback) {
    http.get('http://localhost:3000/questions/next/0', function (res) {
        var dataTotal = '';
        res.on('data', function (data) {
            dataTotal += data;
        });
        res.on('end', function () {
            var questions = JSON.parse(dataTotal);
            callback(questions);
        });
    });
}
function getRandomNextQuestionCandidates(callback) {
    getNextQuestionCandidates(function (questions) {
        var count = questions.length;
        callback(questions[Math.floor(Math.random(0, count) * count)]);
    });
}

function getAnswers(callback) {
    http.get('http://localhost:3000/questions', function (res) {
        var dataTotal = '';
        res.on('data', function (data) {
            dataTotal += data;
        });
        res.on('end', function () {
            var answers = JSON.parse(dataTotal).answers;
            callback(answers);
        });
    })
}
function getCurrentQuestionRandomAnswer(callback) {
    getAnswers(function (answers) {
        var count = answers.length;
        callback(answers[Math.floor(Math.random(0, count) * count)]);
    });
}

function upVoteQuestion(objectId) {
    var req = http.request(
        {
            host: 'localhost',
            path: '/questions/upvote/' + objectId,
            port: 3000,
            method: 'POST'
        }
    );
    
    req.on('error', function (ex) {
        console.log('request error: ' + ex.message);
    });
    
    req.end();
}
function downVoteQuestion(objectId) {
    var req = http.request(
        {
            host: 'localhost',
            path: '/questions/downvote/' + objectId,
            port: 3000,
            method: 'POST'
        }
    );
    
    req.on('error', function (ex) {
        console.log('request error: ' + ex.message);
    });
    
    req.end();
}
function upVoteAnswer(objectId) {
    var req = http.request(
        {
            host: 'localhost',
            path: '/questions/answers/upvote/' + objectId,
            port: 3000,
            method: 'POST'
        }
    );
    
    req.on('error', function (ex) {
        console.log('request error: ' + ex.message);
    });
    
    req.end();
}
function downVoteAnswer(objectId) {
    var req = http.request(
        {
            host: 'localhost',
            path: '/questions/answers/downvote/' + objectId,
            port: 3000,
            method: 'POST'
        }
    );
    
    req.on('error', function (ex) {
        console.log('request error: ' + ex.message);
    });
    
    req.end();
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

setInterval(function () {
    addNextQuestion();
}, 1000);

setInterval(function () {
    addAnswer();
}, 1000);

setInterval(function () {
    getCurrentQuestionRandomAnswer(function (answer) {
        for (var i = 0; i < getRandomNumber(minVotes, maxVotes); i++) {
            upVoteAnswer(answer._id);
        }
    });
}, 5000);
setInterval(function () {
    getCurrentQuestionRandomAnswer(function (answer) {
        for (var i = 0; i < getRandomNumber(minVotes, maxVotes); i++) {
            downVoteAnswer(answer._id);
        }
    });
}, 5000);

setInterval(function () {
    getRandomNextQuestionCandidates(function (question) {
        for (var i = 0; i < getRandomNumber(minVotes, maxVotes); i++) {
            upVoteQuestion(question._id);
        }
    });
}, 5000);
setInterval(function () {
    getRandomNextQuestionCandidates(function (question) {
        for (var i = 0; i < getRandomNumber(minVotes, maxVotes); i++) {
            downVoteQuestion(question._id);
        }
    });
}, 5000);

/*
getRandomNextQuestionCandidates(function (question) {
    console.log(question.text);
    console.log(question.downVotes);
    downVoteQuestion(question._id);
});
*/

/*
getCurrentQuestionRandomAnswer(function (answer) {
    console.log(answer.text);
    console.log(answer.downVotes);
    downVoteAnswer(answer._id);
});
*/