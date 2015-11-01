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

content.getNextQuestionCandidates(0, function (questions) {
    console.log(questions);
});