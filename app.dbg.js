var content = require('./data/content.js');

console.log('about to retrieve top question...');
content.getCurrentQuestion(function (currentQuestion) {
    console.log('and the top question is... ' + currentQuestion.text);
});
console.log('done...');