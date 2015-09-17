var content = require('./data/content');
var readline = require('readline');

/*
console.log('about to retrieve top question...');
content.getCurrentQuestion(function (currentQuestion) {
    console.log('and the top question is... ' + currentQuestion.text);
});
*/

/*
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
*/

/*
console.log('getting next question candidates...');
content.getNextQuestionCandidates(function (questions) {
    console.log('found ' + questions.length + ' question(s)...');
    
    var i;
    for (i = 0; i < questions.length; i++) {
        console.log('question #' + i + ' with ' + questions[i].upVotes + 'votes');
        console.log(questions[i].text);        
    }
});
*/

/*
console.log('getting top next question candidate...');
content.getTopNextQuestionCandidate(function (question) {
    if (question !== undefined) {
        console.log("next question votes :: " + question.upVotes);
        console.log("next question :: " + question.text);
    }
});
*/

/*
console.log('testing up votes...');
content.getNextQuestionCandidates(function (questions) {
    console.log("Found " + questions.length + " question(s)...");
    if (questions.length === 0) {
        throw "Expected to have more questions than 0...";
    }
    
    var randomQuestionIndex = Math.floor(Math.random() * questions.length);
    
    console.log("Question selected:\n" + questions[randomQuestionIndex].text);
    console.log("Question votes :: " + questions[randomQuestionIndex].upVotes);
    
    console.log("upvoting questions...");
    
    content.upVoteQuestion(questions[randomQuestionIndex], function () {
        console.log("question upvoting complete...");
        
        content.getQuestionByObjectId(questions[randomQuestionIndex]._id, function (question) {
            console.log("Question votes :: " + question.upVotes);
        });
    });
});
*/

/*
console.log('testing down votes...');
content.getNextQuestionCandidates(function (questions) {
    console.log("Found " + questions.length + " question(s)...");
    if (questions.length === 0) {
        throw "Expected to have more questions than 0...";
    }
    
    var randomQuestionIndex = Math.floor(Math.random() * questions.length);
    
    console.log("Question selected:\n" + questions[randomQuestionIndex].text);
    console.log("Question votes :: " + questions[randomQuestionIndex].downVotes);
    
    console.log("downvoting questions...");
    
    content.downVoteQuestion(questions[randomQuestionIndex], function () {
        console.log("question downvoting complete...");
        
        content.getQuestionByObjectId(questions[randomQuestionIndex]._id, function (question) {
            console.log("Question votes :: " + question.downVotes);
        });
    });
});
*/

console.log('testing setting next question...');
content.getCurrentQuestion(function (question) {
    console.log('current question :: ' + question.text);
    content.setCurrentQuestion(undefined, function (question) {
        console.log('new current question :: ' + question.text);
        console.log('new current question votes :: ' + question.upVotes);
    });
});