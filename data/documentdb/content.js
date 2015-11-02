var DocumentClient = require('documentdb').DocumentClient;
var Guid = require('guid');
var assert = require('assert');

function DocContent(connectionInfo) {
    this.databaseLink = connectionInfo.databaseLink;
    this.databaseName = connectionInfo.databaseName;
    this.questionsCol = connectionInfo.questionColLink;
    this.questionsColName = connectionInfo.questionColName;
    this.client = new DocumentClient(connectionInfo.hostUrl, {masterKey: connectionInfo.masterKey});
}

function revertIdProperty(document) {
    if (document.hasOwnProperty('_id')) {
        document.id = document._id;
        delete document._id;
    }
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

function addId(content) {
    if (!content.id) {
        content.id = Guid.raw();
    }
}
DocContent.prototype.documentLink = function (document) {
    return 'dbs/' + this.databaseName + '/colls/' + this.questionsColName + '/docs/' + document.id;
};

DocContent.prototype.updateDocument = function (document, callback) {
    this.revertIdProperty(document);
    this.client.replaceDocument(this.documentLink(document), document, callback);
};

/******************************************************************************
                            implementing required functionality
*****************************************************************************/

DocContent.prototype.getQuestionByObjectId = function (objectId, callback) {
    var query = {
        query: 
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
            FROM questions q \
            WHERE q.id = @id',
        parameters: [
            {
                name: '@id',
                value: objectId
            }
        ]
    };
    
    this.client.queryDocuments(this.questionsCol, query)
        .toArray(function (err, results) {
            assert.equal(err, null);
            if (err || results.length === 0) {
                callback(null);
            }
            else {
                callback(results[0]);
            }
        });
};

DocContent.prototype.getCurrentQuestion = function (callback) {
    var query = 
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
        FROM questions q \
        WHERE q.isCurrent = true';
        
    this.client.queryDocuments(this.questionsCol, query)
        .toArray(function (err, results) {
            assert.equal(err, null);
            if (err || results.length === 0) {
                callback(null);
            }
            else {
                callback(results[0]);
            }
        });
};

DocContent.prototype.setCurrentQuestion = function (question, callback) {
    throw { name: 'NotImplementedError', message: 'This has not been implemented yet' };
};

DocContent.prototype.addNextQuestionCandidate = function (question, callback) {
    throw { name: 'NotImplementedError', message: 'This has not been implemented yet' };
};

DocContent.prototype.getNextQuestionCandidates = function (count, callback) {
    var query = 
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
        FROM questions q \
        WHERE q.isNextPossibility = true \
        ORDER BY q.upVotes DESC';
        
    this.client.queryDocuments(this.questionsCol, query)
        .toArray(function (err, results) {
            assert.equal(err, null);
            if (err) {
                callback(null);
            }
            else {
                if (count === undefined || count === null || count === 0) {
                    callback(results);
                }
                else {
                    callback(results.slice(0, count));
                }
            }
        });
};

DocContent.prototype.getNextQuestionCandidateWithMostTotalVotes = function (callback) {
    this.getNextQuestionCandidates(0, function (questions) {
        if (!questions) {
            callback(null);
        }
        else {
            questions.sort(function (a, b) {
                return (b.upVotes + b.downVotes) - (a.upVotes + a.downVotes);
            });
            callback(questions[0]);
        }
    });
};

DocContent.prototype.getNextQuestionCandidateWithMostDownVotes = function (callback) {
    var query = 
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
        FROM questions q \
        WHERE q.isNextPossibility = true \
        ORDER BY q.downVotes DESC';
        
    this.client.queryDocuments(this.questionsCol, query)
        .toArray(function (err, results) {
            assert.equal(err, null);
            if (err) {
                callback(null);
            }
            else {
                callback(results[0]);
            }
        });
};

DocContent.prototype.getTopNextQuestionCandidate = function (callback) {
    this.getNextQuestionCandidates(1, function (questions) {
        if (!questions || questions.length === 0) {
            callback(null);
        }
        else {
            callback(questions[0]);
        }
    });
};

DocContent.prototype.upVoteQuestion = function (questionId, callback) {
    throw { name: 'NotImplementedError', message: 'This has not been implemented yet' };
};
DocContent.prototype.downVoteQuestion = function (questionId, callback) {
    throw { name: 'NotImplementedError', message: 'This has not been implemented yet' };
};
DocContent.prototype.setNoQuestionDate = function (callback) {
    throw { name: 'NotImplementedError', message: 'This has not been implemented yet' };
};
DocContent.prototype.getNoQuestionDate = function (callback) {
    throw { name: 'NotImplementedError', message: 'This has not been implemented yet' };
};
DocContent.prototype.addAnswer = function (question, answerText, callback) {
    throw { name: 'NotImplementedError', message: 'This has not been implemented yet' };
};
DocContent.prototype.upVoteAnswer = function (answerId, callback) {
    throw { name: 'NotImplementedError', message: 'This has not been implemented yet' };
};
DocContent.prototype.downVoteAnswer = function (answerId, callback) {
    throw { name: 'NotImplementedError', message: 'This has not been implemented yet' };
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