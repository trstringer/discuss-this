var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
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

/*
db.questions.aggregate([{$match: {isNextPossibility: true}}, {$project: {document: "$$ROOT", 'totalVotes': {$add: ["$upVotes", "$downVotes"]}}}, {$sort: {totalVotes: -1}}])
*/
function queryNextQuestionCandidateWithMostTotalVotes(db, callback) {
    var cursor = db.collection('questions')
        .aggregate(
            [
                {$match: {isNextPossibility: true}}, 
                {$project: 
                    {
                        document: '$$ROOT', 
                        totalVotes: {$add: ['$upVotes', '$downVotes']}
                    }
                }, 
                {$sort: {totalVotes: -1}}
            ]);
            
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        
        if (doc !== null) {
            callback(doc.document);
        }
    });
}

// get the next question candidate with the highest count 
// of down votes. I see this as being useful when presenting 
// users with a really bad next question
//
function queryNextQuestionCandidateWithMostDownVotes(db, callback) {
    var cursor = db.collection('questions')
        .find({ isNextPossibility: true })
        .sort({ downVotes: -1 })
        .limit(1);
        
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        
        if (doc !== null) {
            callback(doc);
        }
    });
}

// this logic assumes that the next question should be 
// the question with the highest amount of up votes.
// at the moment this is the safest assumption but is 
// definitely subject to change
//
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


// ********************************************************
//                  answers
// ********************************************************

function queryAnswer(db, answerObjectId, callback) {
    var cursor = db.collection('questions')
        .find( 
            { 'answers._id': answerObjectId },
            { _id: 0, 'answers.$': 1 } 
        );
        
    cursor.next(function (err, doc) {
        assert.equal(err, null);
        
        if (doc !== null && doc.answers.length >= 1) {
            callback(doc.answers[0]);
        }
    });
}

function insertAnswer(db, question, answer, callback) {
    // inject an ObjectId() if it doesn't already exist
    //
    if (answer._id === undefined)
        answer._id = new ObjectId();
    
    db.collection('questions')
        .update(
            { _id: question._id},
            { $push: { answers: answer }},
            function (result) {
                callback(result);
            }
        );
}
exports.addAnswer = function (question, answer, callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        insertAnswer(db, question, answer, function (result) {
            db.close();
            exports.getCurrentQuestion(function (question) {
                callback(question);
            });
        });
    });
}

function addUpVoteToAnswer(db, answer, callback) {
    db.collection('questions')
        .update(
            { 'answers._id': answer._id },
            { $inc: { 'answers.$.upVotes': 1 }},
            function (result) {
                callback(result);
            }
        );
}
exports.upVoteAnswer = function (answer, callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        
        addUpVoteToAnswer(db, answer, function (result) {
            queryAnswer(db, answer._id, function (answer) {
                db.close();
                callback (answer);
            });
        });
    });
}

function addDownVoteToAnswer(db, answer, callback) {
    db.collection('questions')
        .update(
            { 'answers._id': answer._id },
            { $inc: { 'answers.$.downVotes': 1 }},
            function (result) {
                callback(result);
            }
        );
}
exports.downVoteAnswer = function (answer, callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        
        addDownVoteToAnswer(db, answer, function (result) {
            queryAnswer(db, answer._id, function (answer) {
                db.close();
                callback (answer);
            });
        });
    });
}