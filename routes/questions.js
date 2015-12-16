var express = require('express');
var router = express.Router();
var content;

if (process.env.DBMS_TYPE === 'documentdb') {
    // documentdb
    content = require('../data/documentdb/content');
}
else {
    // mongodb
    content = require('../data/content');
}

var config = {
    questionIdRefLength: 8
};

function isJobKeyValid(jobKey) {
    if (!jobKey || jobKey !== process.env.JOBKEY) {
        return false;
    }
    else {
        return true;
    }
}

router.get('/', function (req, res, next) {
    content.getCurrentQuestion(function (currentQuestion) {
        res.status(200).json(currentQuestion);
    });
});
router.get('/:questionid', function (req, res, next) {
    var questionId = req.params.questionid;
    
    // we need to ensure that the questionid is 8 chars
    if (questionId.length !== config.questionIdRefLength) {
        res.status(400).send();
    }
    
    if (questionId) {
        // we need to first see if this requested question is
        // the current question
        content.getCurrentQuestion(function (currentQuestion) {
            if (currentQuestion && currentQuestion._id.substring(0, 8) === questionId) {
                // this is the current question, so we should just 
                // display the current question as-is
                res.redirect('/');
            }
            else {
                // the user wants to display the summary of 
                // the question
                content.getQuestionByPartialId(questionId, function (question) {
                    if (question && question.answers && question.answers.length > 0) {
                        question.answers.sort(function (a, b) {
                            return b.upVotes - a.upVotes;
                        });
                        res.render('question', {
                            questionText: question.text,
                            dateAsked: question.dateAsked,
                            answerText: question.answers[0].text,
                            answerUpVotes: question.answers[0].upVotes
                        });
                    }
                    else {
                        res.status(400).send();
                    }
                });
            }
        });
    }
});


router.post('/gen/:jobkey', function (req, res, next) {
    var jobKey = req.params.jobkey;
    
    if (isJobKeyValid(jobKey)) {
        content.getTopNextQuestionCandidate(function (question) {
            if (question === undefined || question === null) {
                res.status(400).send('not possible next question');
            }
            else {
                content.setCurrentQuestion(question, function (question) {
                    res.status(200).json(question);
                });
            }
        });
    }
    else {
        res.status(401).send();
    }
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

router.post('/answers/upvote/:answerId', function(req, res, next) {
    var answerId = req.params.answerId;
    if (typeof answerId === 'undefined' || answerId === null || answerId === "") {
        res.status(400).send('incorrect format for answerId');
    }
    else {
        content.upVoteAnswer(answerId, function (answer) {
            // test for a null answer, which should mean that 
            // the answer doesn't exist given the objectid
            //
            if (answer === null) {
                res.status(400).json('answer not found');
            }
            else {
                res.status(200).json(answer);
            }
        });
    }
});

router.post('/answers/downvote/:answerId', function(req, res, next) {
    var answerId = req.params.answerId;
    if (typeof answerId === 'undefined' || answerId === null || answerId === "") {
        res.status(400).send('incorrect format for answerId');
    }
    else {
        content.downVoteAnswer(answerId, function (answer) {
            // test for a null answer, which should mean that 
            // the answer doesn't exist given the objectid
            //
            if (answer === null) {
                res.status(400).json('answer not found');
            }
            else {
                res.status(200).json(answer);
            }
        });
    }
});

router.post('/upvote/:questionId', function (req, res, next) {
    var questionId = req.params.questionId;
    if (typeof questionId === 'undefined' || questionId === null || questionId === "") {
        res.status(400).send('incorrect format for questionId');
    }
    else {
        content.upVoteQuestion(questionId, function (question) {
            if (question === null) {
                res.status(400).json('question not found');
            }
            else {
                res.status(200).json(question);
            }
        });
    }
});

router.post('/downvote/:questionId', function (req, res, next) {
    var questionId = req.params.questionId;
    if (typeof questionId === 'undefined' || questionId === null || questionId === "") {
        res.status(400).send('incorrect format for questionId');
    }
    else {
        content.downVoteQuestion(questionId, function (question) {
            if (question === null) {
                res.status(400).json('question not found');
            }
            else {
                res.status(200).json(question);
            }
        });
    }
});

router.get('/noquestion/', function (req, res, next) {
    content.getNoQuestionDate(function (noQuestion) {
        res.status(200).send(noQuestion);
    });
});
router.post('/noquestion/:jobkey', function (req, res, next) {
    var jobKey = req.params.jobkey;
    if (isJobKeyValid(jobKey)) {
        content.unsetCurrentQuestion(function () {
            content.setNoQuestionDate(function () {
                res.status(200).send();
            });
        });
    }
    else {
        res.status(401).send();
    }
});

router.post('/dectimeremaining/:jobkey', function (req, res, next) {
    var jobKey = req.params.jobkey;
    if (isJobKeyValid(jobKey)) {
        content.decrementCurrentEntityRemainingTime(function (err, doc) {
            res.status(200).send(doc);
        });
    }
    else {
        res.status(401).send();
    }
});

module.exports = router;