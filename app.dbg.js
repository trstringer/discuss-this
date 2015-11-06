var content;
var readline = require('readline');

if (process.env.DBMS_TYPE === 'documentdb') {
    content = require('./data/documentdb/content');
}

console.log('debugging...');

/*
content.getCurrentQuestions(function (err, results) {
    for (var i = 0; i < results.length; i++) {
        if (results[i].answers) {
            for (var j = 0; j < results[i].answers.length; j++) {
                if (!results[i].answers[j].id) {
                    content.addId(results[i].answers[j]);
                }
            }
            content.updateDocument(results[i], function (err, results) {
                console.log(results);
            });
        }
    }
});
*/

/*
content.getCurrentQuestion(function (question) {
    console.log(question);
});
*/

/*
content.getQuestionByObjectId('dce31933-806d-53aa-9890-347f08bb39e6', function (question) {
    console.log(question);
});
*/

/*
content.getNextQuestionCandidates(0, function (questions) {
    console.log(questions);
});
*/

/*
content.getNextQuestionCandidateWithMostTotalVotes(function (question) {
    console.log(question);
});
*/

/*
content.getNextQuestionCandidateWithMostDownVotes(function (question) {
    console.log(question); 
});
*/

/*
content.getTopNextQuestionCandidate(function (question) {
    console.log(question);
});
*/

/*
content.getCurrentQuestion(function (question) {
    console.log('current question: ' + question.text);
    content.getTopNextQuestionCandidate(function (question) {
        console.log('next question: ' + question.text);
        content.setCurrentQuestion(null, function (question) {
            console.log('current question: ' + question.text);
        });
    });
});
*/

/*
content.addNextQuestionCandidate('this is my new great question...', function (question) {
    console.log(question.text);
});
*/

/*
content.getCurrentQuestion(function (question) {
    console.log('current downvotes: ' + question.downVotes);
    content.downVoteQuestion(question._id, function (question) {
        console.log('new downvotes: ' + question.downVotes);
    });
});
*/

/*
content.getCurrentQuestion(function (question) {
    content.addAnswer(question, 'this is my amazing new answer', function (question) {
        console.log(question.answers[question.answers.length - 1].text);
    });
});
*/

/*
content.getQuestionByAnswerId('c0a0c754-d316-ee4a-d9de-92f28beccfd5', function (question) {
    console.log(question);
});
*/

/*
content.getCurrentQuestion(function (question) {
    console.log('current downVotes: ' + question.answers[0].downVotes);
    console.log('answer id: ' + question.answers[0]._id);
    content.downVoteAnswer(question.answers[0]._id, function (answer) {
        console.log('new downVotes: ' + answer.downVotes);
    });
});
*/

/*
content.getNoQuestionDate(function (noQuestionStartDate) {
    console.log('no question start date: ' + noQuestionStartDate);
});
*/

content.setNoQuestionDate(function () {
    content.getNoQuestionDate(function (noQuestionDate) {
        console.log('no question start date: ' + noQuestionDate);
    });
});