var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/letsdiscuss';

// ********************************************************
//                  helpers
// ********************************************************

function queryQuestionByObjectId(db, objectId, callback) {
    var cursor = 
        db.collection('questions').find({ _id: objectId });
        
    cursor.next(function (err, doc) {
        assert.equal(err, null);
        
        if (doc !== null) {
            callback(doc);
        }
    });
}
exports.getQuestionByObjectId = function (objectId, callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        queryQuestionByObjectId(db, objectId, function (question) {
            db.close();
            callback(question);
        });
    });
}


// ********************************************************
//                  current question
// ********************************************************

function queryCurrentQuestion(db, callback) {
    var cursor = 
        db.collection('questions').find({isCurrent: true});
    
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc !== null) {
            callback(doc);
        }
    });
}
exports.getCurrentQuestion = function (callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        
        queryCurrentQuestion(db, function (topQuestion) {
            db.close();
            callback(topQuestion);
        });
    });
}

function archiveUnselectedNextQuestionCandidates(db, callback) {
    db.collection('questions')
        .update(
            { isCurrent: false, isNextPossibility: true },
            { $set: { isNextPossibility: false }},
            function (result) {
                callback(result);
            }
        );
}
function archiveCurrentQuestion(db, callback) {
    db.collection('questions')
        .update(
            { isCurrent: true },
            { $set: { isCurrent: false }},
            function (result) {
                callback(result);
            }
        );
}
function setQuestionAsCurrent(db, question, callback) {
    // first we need to set all other candidate questions 
    // as no longer a possibility for the next question
    //
    archiveUnselectedNextQuestionCandidates(db, function (result) {
        archiveCurrentQuestion(db, function(result) {
            if (question !== undefined) {
                db.collection('questions')
                    .update(
                        { _id: question._id },
                        { $set: { isCurrent: true, isNextPossibility: false }},
                        function (result) {
                            //callback(result);
                            exports.getCurrentQuestion(function (question) {
                                callback(question);
                            });
                        }
                    );
            }
            else {
                exports.getTopNextQuestionCandidate(function (question) {
                    db.collection('questions')
                        .update(
                            { _id: question._id },
                            { $set: { isCurrent: true, isNextPossibility: false }},
                            function (result) {
                                //callback(result);
                                exports.getCurrentQuestion(function (question) {
                                    callback(question);
                                });
                            }
                        );
                });
            }
        });
    });
}
exports.setCurrentQuestion = function (question, callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        
        setQuestionAsCurrent(db, question, function (currentQuestion) {
            db.close();
            callback(currentQuestion);
        });
    });
}


// ********************************************************
//                  next question
// ********************************************************

function insertNextQuestionCandidate(db, question, callback) {
    db.collection('questions').insertOne(question, function (err, result) {
        assert.equal(err, null);
        callback(result);
    });
}
exports.addNextQuestionCandidate = function (question, callback) {
    mongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        insertNextQuestionCandidate(db, question, function () {
            db.close();
            callback();
        });
    })
}

function queryNextQuestionCandidates(db, callback) {
    var cursor = db.collection('questions')
        .find({
            isNextPossibility: true
        })
        .sort({
            upVotes: -1
        });
    
    var questions = [];
    var i = 0;
    
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        
        if (doc === null) {
            callback(questions);
        }
        else {
            questions[i] = doc;
            i++;
        }
    });
}
exports.getNextQuestionCandidates = function (callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        queryNextQuestionCandidates(db, function (questions) {
            db.close();
            callback(questions);
        })
    });
}

function queryTopNextQuestionCandidate(db, callback) {
    var cursor = db.collection('questions')
        .find({
            isNextPossibility: true
        })
        .sort({
            upVotes: -1
        })
        .limit(1);
        
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        
        if (doc !== null) {
            callback(doc);
        }
    });
}
exports.getTopNextQuestionCandidate = function (callback) {
    mongoClient.connect(url, function (err, db) {
        queryTopNextQuestionCandidate(db, function (question) {
            db.close();
            callback(question);
        })
    });
}

function addUpVoteToQuestion(db, question, callback) {
    db.collection('questions')
        .update(
            { _id: question._id },
            { $inc: { upVotes: 1 }},
            function (err, results) {
                assert.equal(err, null);
                callback(results);
            }
        );
}
exports.upVoteQuestion = function (question, callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        addUpVoteToQuestion(db, question, function (result) {
            db.close();
            callback();
        });
    })
}

function addDownVoteToQuestion(db, question, callback) {
    db.collection('questions')
        .update(
            { _id: question._id },
            { $inc: { downVotes: 1 }},
            function (err, results) {
                assert.equal(err, null);
                callback(results);
            }
        );
}
exports.downVoteQuestion = function (question, callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        addDownVoteToQuestion(db, question, function (result) {
            db.close();
            callback();
        });
    })
}