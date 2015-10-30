var DocumentClient = require('documentdb').DocumentClient;
var Guid = require('guid');

function DocContent(connectionInfo) {
    this.databaseLink = connectionInfo.databaseLink;
    this.databaseName = connectionInfo.databaseName;
    this.questionsCol = connectionInfo.questionColLink;
    this.questionsColName = connectionInfo.questionColName;
    this.client = new DocumentClient(connectionInfo.hostUrl, {masterKey: connectionInfo.masterKey});
}

DocContent.prototype.revertIdProperty = function (document) {
    if (document.hasOwnProperty('_id')) {
        document.id = document._id;
        delete document._id;
    }
};

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

DocContent.prototype.documentLink = function (document) {
    return 'dbs/' + this.databaseName + '/colls/' + this.questionsColName + '/docs/' + document.id;
};

DocContent.prototype.updateDocument = function (document, callback) {
    this.revertIdProperty(document);
    this.client.replaceDocument(this.documentLink(document), document, function (err, results) {
        callback(err, results);
    });
};

module.exports = new DocContent(
    {
        hostUrl: process.env.DOCUMENTDB_HOST_URL,
        masterKey: process.env.DOCUMENTDB_MASTER_KEY,
        databaseLink: process.env.DOCUMENTDB_DB_LINK, 
        databaseName: process.env.DOCUMENTDB_DB_NAME,
        questionColLink: process.env.DOCUMENTDB_QUESTION_COL_LINK,
        questionColName: process.env.DOCUMENTDB_QUESTION_COL_NAME
    });