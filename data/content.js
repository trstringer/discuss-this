var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/letsdiscuss';

function queryTopQuestions(db, callback) {
    var cursor = 
        db.collection('questions')
            .find()
            .sort({ 'upVotes': -1 })
            .limit(1);
    
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc !== null) {
            callback(doc);
        }
    });
}

exports.getTopQuestions = function (callback) {
    mongoClient.connect(url, function (err, db) {
        queryTopQuestions(db, function (topQuestion) {
            db.close();
            callback(topQuestion);
        });
        
        // console.log('Finished retrieving top question...');
        // console.log(topQuestion);
    });
}