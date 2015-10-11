var http = require('http');
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
    console.log(getRandomQuestion());
}, 1000);

setTimeout(function() {
    setInterval(function () {
        console.log(getRandomAnswer());
    }, 1000);
}, 500);