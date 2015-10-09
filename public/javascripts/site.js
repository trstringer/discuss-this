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
function generateNextQuestionBox(question) {
    return "<div class='col-md-12 new-question voting-item'>" +
            "<div class='col-md-1'>" +
                "<span class='glyphicon glyphicon-chevron-up vote-button'></span>" +
                "<span class='glyphicon glyphicon-chevron-down vote-button'></span>" +
            "</div>" +
            "<div class='col-md-11'>" +
                "<div class='col-md-11 votes'>" +
                    "<div class='col-md-3'>" +
                        "<p class='up-votes'>" + question.upVotes + "</p>" +
                    "</div>" +
                    "<div class='col-md-3'>" +
                        "<p class='down-votes'>" + question.downVotes + "</p>" +
                    "</div>" +
                    "<div class='col-md-3 object-id'>" + question._id + "</div>" + 
                "</div>" +
                "<div class='col-md-11'>" +
                    "<p>" + question.text + "</p>" +
                "</div>" +
            "</div>" +
        "</div>";
}

function insertAnswer(answer) {
    $('.new-answer').before(generateAnswerBox(answer));
}
function insertFirstOrderedUnreviewedAnswer(answers) {
    for (var i = 0; i < answers.length; i++) {
        if (!hasAnswerAlreadyBeenReviewed(answers[i])) {
            insertAnswer(answers[i]);
            break;
        }
    }
}

function insertQuestion(question) {
    $('.new-question-add').before(generateNextQuestionBox(question));
}
function insertFirstOrderedUnreviewedQuestionCandidate(questions) {
    for (var i = 0; i < questions.length; i++) {
        if (!hasQuestionCandidateAlreadyBeenReviewed(questions[i])) {
            insertQuestion(questions[i]);
            break;
        }
    }
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
    if ($.inArray(answer._id, displayedAnswers) >= 0) {
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

function questionCandidateIsCurrentlyDisplayed(question) {
    var displayedQuestionCandidates = [];
    $('.new-question .object-id').each(function () { displayedQuestionCandidates.push($(this).text()); });
    if ($.inArray(question._id, displayedQuestionCandidates) >= 0) {
        return true;
    }
    else {
        return false;
    }
}
function hasQuestionCandidateAlreadyBeenReviewed(question) {
    return questionCandidateIsCurrentlyDisplayed(question);
}

function getAnswerInputText() {
    return $('#newAnswer').val();
}
function clearAnswerInputText() {
    $('#newAnswer').val('');
}
// at the moment, the answers will need to be a minimum 
// of 40 characters. This is subject to change
//
function isSubmittedAnswerValid(answerText) {
    if (answerText.length < 40) {
        return false;
    }
    else {
        return true;
    }
}
function setAnswerInputError() {
    $('.new-answer').addClass('has-error');
    $('.new-answer .error-block').show();
}
function clearAnswerInputError() {
    $('.new-answer').removeClass('has-error');
    $('.new-answer .error-block').hide();
}


// ********************************************************
//                  API helpers
// ********************************************************

function getCurrentQuestion(callback) {
    $.getJSON('/questions/', function (question) {
        callback(question);
    });
}

function sortAnswersByUpVotes(answers) {
    if (answers === undefined || answers === null || answers.length === 0) {
        return;
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
    }
}
function sortAnswersByDownVotes(answers) {
    if (answers === undefined || answers === null || answers.length === 0) {
        return;
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
    }
}

function sortQuestionsByUpVotes(questions) {
    if (questions === undefined || questions === null || questions.length === 0) {
        return;
    }
    else {
        questions.sort(function (a, b) {
            if (a.upVotes > b.upVotes) {
                return -1;
            }
            else if (a.upVotes < b.UpVotes) {
                return 1;
            }
            return 0;
        });
    }
}

function getNextQuestionCandidates(callback) {
    // make an API to get all next question candidates by specifying 
    // zero (0) as the question count, instead of specifying a 
    // positive number to limit the return
    //
    $.getJSON('/questions/next/0/', function (questions) {
        callback(questions);
    });
}

function addAnswer(answerText, callback) {
    $.post(
        '/questions/answers/', 
        { answerText: answerText },
        function (question) {
            callback(question);
        });
}


// ********************************************************
//                  initial load
// ********************************************************

function initialLoadActions() {
    populateCurrentQuestion();
    populateNextQuestions();
    
    $('#addAnswer').click(submitAnswer);
    
    // do an initial hide on this error
    //
    clearAnswerInputError();
}

function populateCurrentQuestion() {
    getCurrentQuestion(function (question) {
        setCurrentQuestion(question.text);
                
        if (question.answers === undefined || question.answers === null || question.answers.length === 0) {
            return;
        }
        // this will add currently three (3) answers to the display 
        // provided that there are three (3) valid answers that can 
        // and should be displayed
        //
        // three (3) answers has been chosen as a good cycling sample 
        // so that the user isn't shown too many for UX. When the user 
        // votes on answers (or [not implemented yet] dismisses answers) 
        // then different answers will show
        //
        else {
            sortAnswersByUpVotes(question.answers);
            insertFirstOrderedUnreviewedAnswer(question.answers);
            
            if (question.answers.length > 1) {
                // insert another high up vote answer
                //
                // the logic here is that the previously inserted 
                // answer into the GUI won't get re-inserted due to 
                // the check that it is already been reviewed, moving 
                // onto the next one
                //
                insertFirstOrderedUnreviewedAnswer(question.answers);
                
                // now if there are enough answers, sort the answers 
                // by down votes so that we show an "unpopular" 
                // answer
                //
                if (question.answers.length > 2) {
                    sortAnswersByDownVotes(question.answers);
                    insertFirstOrderedUnreviewedAnswer(question.answers);
                }
            }
        }
    });
}

function populateNextQuestions() {
    getNextQuestionCandidates(function (questions) {
        if (questions === undefined || questions === null || questions.length === 0) {
            return;
        }
        sortQuestionsByUpVotes(questions);
        
        // insert the first next question candidate
        //
        insertFirstOrderedUnreviewedQuestionCandidate(questions);
        if (questions.length > 1) {
            insertFirstOrderedUnreviewedQuestionCandidate(questions);
            if (questions.length > 2) {
                insertFirstOrderedUnreviewedQuestionCandidate(questions);
            }
        }
    });
}

function submitAnswer() {
    var answerText = getAnswerInputText();
    if (isSubmittedAnswerValid(answerText)) {
        // clear any error if it has it just in case
        //
        clearAnswerInputError();
        
        addAnswer(answerText, function (question) {
            // not currently sure what to do after the user 
            // adds an answer.
            //
            // currently I'm thinking... do nothing
            //
        });
    }
    else {
        // answer submitted isn't valid
        //
        // we don't want to clear the input text in case 
        // the user just wants to append to what they 
        // already have
        //
        setAnswerInputError();
    }
}

$(function () {
    initialLoadActions();
});