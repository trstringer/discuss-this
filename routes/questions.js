var express = require('express');
var content = require('../data/content');
var router = express.Router();

router.get('/', function (req, res, next) {
    content.getCurrentQuestion(function (currentQuestion) {
        res.status(200).json(currentQuestion);
    });
});

router.get('/next/', function (req, res, next) {
    content.getTopNextQuestionCandidate(function (question) {
        res.status(200).json(question);
    });
});

router.get('/next/unpopular/', function (req, res, next) {
    content.getNextQuestionCandidateWithMostDownVotes(function (question) {
        res.status(200).json(question);
    });
});

module.exports = router;