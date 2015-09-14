var content = require('./data/content');

console.log('about to retrieve top question...');
content.getCurrentQuestion(function (currentQuestion) {
    console.log('and the top question is... ' + currentQuestion.text);
});