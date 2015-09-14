var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/letsdiscuss';

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
        queryCurrentQuestion(db, function (topQuestion) {
            db.close();
            callback(topQuestion);
        });
    });
}