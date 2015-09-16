var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/letsdiscuss';

// ********************************************************
//                  current question
// ********************************************************

function queryCurrentQuestion(db, callback) {
    var cursor = 
        db.collection('questions').find({"isCurrent": true});
    
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
        else {
            callback();
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