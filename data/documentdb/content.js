var DocumentClient = require('documentdb').DocumentClient;
var Guid = require('guid');

function DocContent(connectionInfo) {
    this.databaseLink = connectionInfo.databaseLink;
    this.questionsCol = connectionInfo.questionColLink;
    this.client = new DocumentClient(connectionInfo.hostUrl, {masterKey: connectionInfo.masterKey});
}

DocContent.prototype.getCurrentQuestions = function (callback) {
    var selectAllQuestionsQuery = //'SELECT * FROM questions q';
        'SELECT \
            q.id as _id, \
            q.text, \
            q.upVotes, \
            q.downVotes, \
            q.isCurrent, \
            q.isNextPossibility, \
            q.dateCreated, \
            q.dateAsked, \
            q.answers \
        FROM questions q'; 
        
    this.client.queryDocuments(this.questionsCol, selectAllQuestionsQuery)
        .toArray(callback);
};

DocContent.prototype.addId = function (content) {
    if (!content.id) {
        content.id = Guid.raw();
    }
};

module.exports = new DocContent(
    {
        hostUrl: process.env.DOCUMENTDB_HOST_URL,
        masterKey: process.env.DOCUMENTDB_MASTER_KEY,
        databaseLink: process.env.DOCUMENTDB_DB_LINK, 
        questionColLink: process.env.DOCUMENTDB_QUESTION_COL_LINK
    });