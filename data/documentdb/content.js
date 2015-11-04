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

DocContent.prototype.revertIdProperty = function (document) {
    var docCached = {
        id: document._id || document.id,
        dateCreated: document.dateCreated,
        downVotes: document.downVotes,
        isCurrent: document.isCurrent,
        isNextPossibility: document.isNextPossibility,
        text: document.text,
        upVotes: document.upVotes
    };
    return docCached;
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
    var modifiedDoc = this.revertIdProperty(document);
    this.client.replaceDocument(this.documentLink(modifiedDoc), modifiedDoc, callback);
};

DocContent.prototype.insertDocument = function (document, callback) {
    var modifiedDoc = this.revertIdProperty(document);
    this.client.createDocument(this.questionsCol, modifiedDoc, callback);
}

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

DocContent.prototype.updateQuestionAsCurrent = function (question, callback) {
    if (!question) {
        this.getTopNextQuestionCandidate(question => {
            if (question) {
                question.isCurrent = true;
                this.updateDocument(question, callback);
            }
        });
    }
    else {
        question.isCurrent = true;
        this.updateDocument(question, callback);
    }
}
DocContent.prototype.archiveUnselectedQuestions = function (callback) {
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
        WHERE q.isNextPossibility = true';
        
    this.client.queryDocuments(this.questionsCol, query)
        .forEach((err, element) => {
            assert.equal(err, null);
            if (!err && !element) {
                callback();
            }
            else {
                element.isNextPossibility = false;
                this.updateDocument(element, function (err, res) {
                    assert.equal(err, null);
                    callback(element);
                });
            }
        });
}
DocContent.prototype.unsetCurrentQuestion = function (callback) {
    this.getCurrentQuestion(question => {
        if (question) {
            question.isCurrent = false;
            this.updateDocument(question, callback);
        }
        else {
            callback(null);
        }
    });
}
//
// the order of events to set a current question is as follows
//  1. set the current question as not the current question
//  2. set the next question as the current question
//  3. unset all next possibilities as not next possibilities
//
DocContent.prototype.setCurrentQuestion = function (question, callback) {
    this.unsetCurrentQuestion((err, res) => {
        assert.equal(err, null);
        this.updateQuestionAsCurrent(question, (err, res) => {
            assert.equal(err, null);
            this.archiveUnselectedQuestions(archivedAnswer => {
                if (!archivedAnswer) {
                    this.getCurrentQuestion(callback);
                }
            });
        });
    });
};

DocContent.prototype.addNextQuestionCandidate = function (questionText, callback) {
    var newQuestion = {
        _id: Guid.raw(),
        text: questionText,
        upVotes: 0,
        downVotes: 0,
        isCurrent: false,
        isNextPossibility: true,
        dateCreated: new Date()
    };
    
    this.insertDocument(newQuestion, (err, res) => {
        assert.equal(err, null);
        this.getQuestionByObjectId(newQuestion._id, callback);
    });
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