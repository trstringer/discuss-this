var content = require('./data/content');
var readline = require('readline');

/*
console.log('about to retrieve top question...');
content.getCurrentQuestion(function (currentQuestion) {
    console.log('and the top question is... ' + currentQuestion.text);
});
*/

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("question text ", function (questionText) {
    rl.question("upVotes ", function (upVotes) {
        rl.question("downVotes", function (downVotes) {
            rl.question("isCurrent", function (isCurrent) {
                rl.question("isNextPossibility", function (isNextPossibility) {
                    content.addNextQuestionCandidate({
                        text: questionText,
                        upVotes: Number(upVotes),
                        downVotes: Number(downVotes),
                        isCurrent: JSON.parse(isCurrent),
                        isNextPossibility: JSON.parse(isNextPossibility)
                    }, function () {
                        console.log("finished adding your question :: " + questionText);
                    });
                })
            })
        })
    })
})