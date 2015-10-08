// ********************************************************
//                  UI helpers
// ********************************************************

function generateAnswerBox(answer) {
    return "<div class='col-md-12 answer voting-item'>" +
            "<div class='col-md-1'>" +
                "<span class='glyphicon glyphicon-chevron-up vote-button'></span>" +
                "<span class='glyphicon glyphicon-chevron-down vote-button'></span>" +
            "</div>" +
            "<div class='col-md-11'>" +
                "<div class='col-md-11 votes'>" +
                    "<div class='col-md-3'>" +
                        "<p class='up-votes'>" + answer.upVotes + "</p>" +
                    "</div>" +
                    "<div class='col-md-3'>" +
                        "<p class='down-votes'>" + answer.downVotes + "</p>" +
                    "</div>" +
                    "<div class='col-md-3 object-id'>" + answer._id + "</div>" +                    
                "</div>" +
                "<div class='col-md-11'>" +
                    "<p>" + answer.text + "</p>" +
                "</div>" +
            "</div>" +
        "</div>";
}

function insertAnswer(answer) {
    $('.new-answer').before(generateAnswerBox(answer));
}

function setCurrentQuestion(questionText) {
    $("#currentQuestionText").text(questionText);
}

function countDisplayedAnswers() {
    return $('.answer').length;
}

function answerIsCurrentlyDisplayed(answer) {
    var displayedAnswers = [];
    $('.answer .object-id').each(function () { displayedAnswers.push($(this).text()); });
    if ($.inArray(answer._id, displayedAnswers) === 1) {
        return true;
    }
    else {
        return false;
    }
}
// this is the wrapper function to consolidate all of 
// the logic to determine if the answer doesn't meet any 
// of the following criteria:
//
// - is currently being reviewed (on the screen)
// - (not implemented yet) was already reviewed (local storage)
// 
function hasAnswerAlreadyBeenReviewed(answer) {
    return answerIsCurrentlyDisplayed(answer);
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

function sortAnswersByUpVotes(answers) {
    if (answers === undefined || answers === null || answers.length === 0) {
        return null;
    }
    else {
        answers.sort(function (a, b) {
            if (a.upVotes > b.upVotes) {
                return -1;
            }
            else if (a.upVotes < b.upVotes) {
                return 1;
            }
            return 0;
        });
        return answers;
    }
}
function sortAnswersByDownVotes(answers) {
    if (answers === undefined || answers === null || answers.length === 0) {
        return null;
    }
    else {
        answers.sort(function (a, b) {
            if (a.downVotes > b.downVotes) {
                return -1;
            }
            else if (a.downVotes < b.downVotes) {
                return 1;
            }
            return 0;
        });
        return answers;
    }
}


// ********************************************************
//                  initial load
// ********************************************************

function initialLoadActions() {
    getCurrentQuestion(function (question) {
        setCurrentQuestion(question.text);
        
        // if (question.answers !== undefined && question.answers !== null) {
        //     var answerCount = question.answers.length;
        //     var i;
        //     for (i = 0; i < answerCount; i++) {
        //         insertAnswer(question.answers[i]);
        //     }
        // }
        
        if (question.answers === undefined || question.answers === null || question.answers.length === 0) {
            return;
        }
        else {
            sortAnswersByUpVotes(question.answers);
            insertAnswer(question.answers[0]);
            if (question.answers.length > 1) {
                insertAnswer(question.answers[1]);
                if (question.answers.length > 2) {
                    sortAnswersByDownVotes(question.answers);
                    insertAnswer(question.answers[0]);
                }
            }
        }
    });
}

$(function () {
    initialLoadActions();
});