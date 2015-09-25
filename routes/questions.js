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
router.post('/next/', function (req, res, next) {
    var inputQuestionText = req.body.questionText;
    if (inputQuestionText === undefined) {
        res.status(400).send('Error when reading POST body data');
    }
    else {
        content.addNextQuestionCandidate(inputQuestionText, function (addedQuestion) {
            res.status(200).json(addedQuestion);
        });
    }
});

router.get('/next/unpopular/', function (req, res, next) {
    content.getNextQuestionCandidateWithMostDownVotes(function (question) {
        res.status(200).json(question);
    });
});

router.get('/next/:count', function (req, res, next) {
    var count = parseInt(req.params.count, 10);
    if (isNaN(count)) {
        res.status(400).send('Input parameter is not a number');
    }
    
    content.getNextQuestionCandidates(count, function (questions) {
        res.status(200).json(questions);
    });
});

router.post('/answers/', function (req, res, next) {
    var answerText = req.body.answerText;
    if (answerText === undefined) {
        res.status(400).send('answer text in bad format');
    }
    else {
        content.getCurrentQuestion(function (question) {
            content.addAnswer(question, answerText, function (question) {
                res.status(200).json(question);
            });
        });
    }
});

module.exports = router;