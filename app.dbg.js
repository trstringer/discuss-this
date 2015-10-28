var content;
var readline = require('readline');

if (process.env.DBMS_TYPE === 'documentdb') {
    content = require('./data/documentdb/content');
}

console.log('debugging...');

content.getCurrentQuestions(function (err, results) {
    console.log(results);
});