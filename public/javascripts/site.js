// ********************************************************
//                  UI helpers
// ********************************************************

function generateAnswerBox(answerText, objectId, upVoteCount, downVoteCount) {
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
                    "<div class='col-md-3 object-id'>" + objectId + "</div>" +                    
                "</div>" +
                "<div class='col-md-11'>" +
                    "<p>" + answerText + "</p>" +
                "</div>" +
            "</div>" +
        "</div>";
}

function insertAnswer(answerText, objectId, upVoteCount, downVoteCount) {
    $('.new-answer').before(
        generateAnswerBox(
            answerText, 
            objectId,
            upVoteCount, 
            downVoteCount
        ));
}

function setCurrentQuestion(questionText) {
    $("#currentQuestionText").text(questionText);
}

function countDisplayedAnswers() {
    return $('.answer').length;
}


// ********************************************************
//                  API helpers
// ********************************************************

function apiRootUrl() {
    return "http://localhost:3000";
}

function getCurrentQuestion(callback) {
    $.getJSON(apiRootUrl() + '/questions/', function (question) {
        callback(question);
    });
}


// ********************************************************
//                  initial load
// ********************************************************

function initialLoadActions() {
    getCurrentQuestion(function (question) {
        setCurrentQuestion(question.text);
        
        if (question.answers !== undefined && question.answers !== null) {
            var answerCount = question.answers.length;
            var i;
            for (i = 0; i < answerCount; i++) {
                insertAnswer(
                    question.answers[i].text,
                    question.answers[i]._id,
                    question.answers[i].upVotes,
                    question.answers[i].downVotes
                );
            }
        }
    });
}

$(function () {
    initialLoadActions();
});