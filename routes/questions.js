var express = require('express');
var content = require('../data/content');
var router = express.Router();

router.get('/', function (req, res, next) {
    content.getCurrentQuestion(function (currentQuestion) {
        res.status(200).json(currentQuestion);
    });
});

module.exports = router;