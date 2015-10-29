var content;
var readline = require('readline');

if (process.env.DBMS_TYPE === 'documentdb') {
    content = require('./data/documentdb/content');
}

console.log('debugging...');

content.getCurrentQuestions(function (err, results) {
    for (var i = 0; i < results.length; i++) {
        if (results[i].answers) {
            for (var j = 0; j < results[i].answers.length; j++) {
                if (!results[i].answers[j].id) {
                    content.addId(results[i].answers[j]);
                }
            }
        }
    }
});