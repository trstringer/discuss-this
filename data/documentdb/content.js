var DocumentClient = require('documentdb').DocumentClient;

function DocContent(connectionInfo) {
    this.databaseLink = connectionInfo.databaseLink;
    this.questionsCol = connectionInfo.questionColLink;
    this.client = new DocumentClient(connectionInfo.hostUrl, {masterKey: connectionInfo.masterKey});
    
    this.getCurrentQuestions = function (callback) {
        this.client.queryDocuments(this.questionsCol, 'SELECT * FROM questions q')
            .toArray(callback);
    };
}

module.exports = new DocContent(
    {
        hostUrl: process.env.DOCUMENTDB_HOST_URL,
        masterKey: process.env.DOCUMENTDB_MASTER_KEY,
        databaseLink: process.env.DOCUMENTDB_DB_LINK, 
        questionColLink: process.env.DOCUMENTDB_QUESTION_COL_LINK
    });