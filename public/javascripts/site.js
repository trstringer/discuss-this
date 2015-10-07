// ********************************************************
//                  UI helpers
// ********************************************************

function generateAnswerBox(answerText, upVoteCount, downVoteCount) {
    return "<div class='col-md-12 answer voting-item'>" +
            "<div class='col-md-1'>" +
                "<span class='glyphicon glyphicon-chevron-up vote-button'></span>" +
                "<span class='glyphicon glyphicon-chevron-down vote-button'></span>" +
            "</div>" +
            "<div class='col-md-11'>" +
                "<div class='col-md-11 votes'>" +
                    "<div class='col-md-3'>" +
                        "<p class='up-votes'>" + upVoteCount + "</p>" +
                    "</div>" +
                    "<div class='col-md-3'>" +
                        "<p class='down-votes'>" + downVoteCount + "</p>" +
                    "</div>" +
                "</div>" +
                "<div class='col-md-11'>" +
                    "<p>" + answerText + "</p>" +
                "</div>" +
            "</div>" +
        "</div>";
}

function insertAnswer(answerText, upVoteCount, downVoteCount) {
    $('.new-answer').before(generateAnswerBox(answerText, upVoteCount, downVoteCount));
}

function setCurrentQuestion(questionText) {
    $("#currentQuestionText").text(questionText);
}


// ********************************************************
//                  API helpers
// ********************************************************

function apiRootUrl() {
    return "http://localhost:3000";
}


// ********************************************************
//                  initial load
// ********************************************************

function getCurrentQuestion(callback) {
    $.getJSON(apiRootUrl() + '/questions/', function (question) {
        callback(question.text);
    });
}


// ********************************************************
//                  initial load
// ********************************************************

function initialLoadActions() {
    getCurrentQuestion(function (questionText) {
        setCurrentQuestion(questionText);
    });
    
    insertAnswer('this is my test insert answer', 10, 50);
}

$(function () {
    initialLoadActions();
});