var content = require('./data/content.js');

console.log('about to retrieve top question...');
var topQuestion = content.getTopQuestions(function (topQuestion) {
    console.log('and the top question is... ' + topQuestion.text);
});
console.log('done...');