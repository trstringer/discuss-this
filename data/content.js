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

function insertNextQuestionCandidate(db, questionText, callback) {
    db.collection('questions')
        .insertOne(
            {
                text: questionText,
                upVotes: 0,
                downVotes: 0,
                isCurrent: false,
                isNextPossibility: true
            }, 
            function (err, result) {
                assert.equal(err, null);
                callback(result);
        });
}
exports.addNextQuestionCandidate = function (question, callback) {
    mongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        insertNextQuestionCandidate(db, question, function (result) {
            db.close();
            if (result.insertedCount >= 1) {
                exports.getQuestionByObjectId(result.insertedId, function (question) {
                    callback(question);
                });
            }
            else {
                callback(null);
            }
        });
    })
}

function queryNextQuestionCandidates(db, count, callback) {
    var cursor = db.collection('questions')
        .find({
            isNextPossibility: true
        })
        .sort({
            upVotes: -1
        })
        .limit(count);
    
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
exports.getNextQuestionCandidates = function (count, callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        queryNextQuestionCandidates(db, count, function (questions) {
            db.close();
            callback(questions);
        })
    });
}

// this function gets the next question candidate with the most 
// total votes, calculated as (upVotes + downVotes). this can be 
// significant as the most "active" question, good or bad
//
// at the moment, this shouldn't necessarily be the next question 
// that is asked, but could possibly be
//
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
exports.getNextQuestionCandidateWithMostTotalVotes = function (callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        
        queryNextQuestionCandidateWithMostTotalVotes(db, function (question) {
            db.close();
            callback(question);
        });
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
exports.getNextQuestionCandidateWithMostDownVotes = function (callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        
        queryNextQuestionCandidateWithMostDownVotes(db, function (question) {
            db.close();
            callback(question);
        });
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
exports.upVoteQuestion = function (questionId, callback) {
    try {
        var questionObjectId = new ObjectId.createFromHexString(questionId);
    }
    catch (err) {
        // need to figure out a logging mechanism but for now let's just 
        // return a null answer
        //
        callback(null);
        return;
    }
    
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        
        queryQuestionByObjectId(db, questionObjectId, function (question) {
            if (question === undefined || question === null) {
                db.close();
                callback(null);
            }
            else {
                addUpVoteToQuestion(db, question, function (result) {
                    queryQuestionByObjectId(db, questionObjectId, function (question) {
                        db.close();
                        callback(question);
                    });
                });
            }
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
exports.downVoteQuestion = function (questionId, callback) {
    try {
        var questionObjectId = new ObjectId.createFromHexString(questionId);
    }
    catch (err) {
        // need to figure out a logging mechanism but for now let's just 
        // return a null answer
        //
        callback(null);
        return;
    }
    
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        
        queryQuestionByObjectId(db, questionObjectId, function (question) {
            if (question === undefined || question === null) {
                db.close();
                callback(null);
            }
            else {
                addDownVoteToQuestion(db, question, function (result) {
                    queryQuestionByObjectId(db, questionObjectId, function (question) {
                        db.close();
                        callback(question);
                    });
                });
            }
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
        else if (doc === null || doc.answer.length === 0) {
            callback(null);
        }
    });
}

function insertAnswer(db, question, answerText, callback) {
    // inject an ObjectId() if it doesn't already exist
    //
    var answer = {
        _id: new ObjectId(),
        text: answerText,
        upVotes: 0,
        downVotes: 0
    };
    
    db.collection('questions')
        .update(
            { _id: question._id},
            { $push: { answers: answer }},
            function (result) {
                callback(result);
            }
        );
}
exports.addAnswer = function (question, answerText, callback) {
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        insertAnswer(db, question, answerText, function (result) {
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
exports.upVoteAnswer = function (answerId, callback) {
    try {
        var answerObjectId = new ObjectId.createFromHexString(answerId);
    }
    catch (err) {
        // need to figure out a logging mechanism but for now let's just 
        // return a null answer
        //
        callback(null);
        return;
    }
    
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        
        queryAnswer(db, answerObjectId, function (answer) {
            if (answer === undefined || answer === null) {
                db.close();
                callback (null);
                return;
            }
            addUpVoteToAnswer(db, answer, function (result) {
                queryAnswer(db, answerObjectId, function (answer) {
                    db.close();
                    callback (answer);
                });
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
exports.downVoteAnswer = function (answerId, callback) {
    try {
        var answerObjectId = new ObjectId.createFromHexString(answerId);
    }
    catch (err) {
        // need to figure out a logging mechanism but for now let's just 
        // return a null answer
        //
        callback(null);
        return;
    }
    
    mongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        
        queryAnswer(db, answerObjectId, function (answer) {
            if (answer === undefined || answer === null) {
                db.close();
                callback (null);
                return;
            }
            addDownVoteToAnswer(db, answer, function (result) {
                queryAnswer(db, answerObjectId, function (answer) {
                    db.close();
                    callback (answer);
                });
            });
        });
    });
}