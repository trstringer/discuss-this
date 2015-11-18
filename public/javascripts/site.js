// ********************************************************
//                  Configuration
// ********************************************************

var config = {
    questionDurationMinutes: 10,
    minInputLength: 30,
    maxDisplayCount: 3,
    refreshInterval: 10,
    pendingQuestionText: '...',
    pendingCountdownText: '...'
};


// ********************************************************
//                  UI helpers
// ********************************************************

function generateAnswerBox(answer) {
    return "<div class='col-xs-12 col-md-12 answer voting-item'>" +
            "<div class='col-xs-2 col-md-1'>" +
                "<span class='glyphicon glyphicon-chevron-up vote-button'></span>" +
                "<span class='glyphicon glyphicon-chevron-down vote-button'></span>" +
            "</div>" +
            "<div class='col-xs-10 col-md-11'>" +
                "<div class='col-xs-12 col-md-11 votes'>" +
                    "<div class='col-xs-3 col-md-3'>" +
                        "<p class='up-votes'>" + answer.upVotes + "</p>" +
                    "</div>" +
                    "<div class='col-xs-3 col-md-3'>" +
                        "<p class='down-votes'>" + answer.downVotes + "</p>" +
                    "</div>" +
                    "<div class='col-xs-3 col-md-3 object-id'>" + answer._id + "</div>" +                    
                "</div>" +
                "<div class='col-xs-12 col-md-11'>" +
                    "<p>" + answer.text + "</p>" +
                "</div>" +
            "</div>" +
        "</div>";
}
function generateNextQuestionBox(question) {
    return "<div class='col-xs-12 col-md-12 new-question voting-item'>" +
            "<div class='col-xs-2 col-md-1'>" +
                "<span class='glyphicon glyphicon-chevron-up vote-button'></span>" +
                "<span class='glyphicon glyphicon-chevron-down vote-button'></span>" +
            "</div>" +
            "<div class='col-xs-10 col-md-11'>" +
                "<div class='col-xs-12 col-md-11 votes'>" +
                    "<div class='col-xs-3 col-md-3'>" +
                        "<p class='up-votes'>" + question.upVotes + "</p>" +
                    "</div>" +
                    "<div class='col-xs-3 col-md-3'>" +
                        "<p class='down-votes'>" + question.downVotes + "</p>" +
                    "</div>" +
                    "<div class='col-xs-3 col-md-3 object-id'>" + question._id + "</div>" + 
                "</div>" +
                "<div class='col-xs-12 col-md-11'>" +
                    "<p>" + question.text + "</p>" +
                "</div>" +
            "</div>" +
        "</div>";
}

function insertAnswer(answer) {
    if (countDisplayedAnswers() < config.maxDisplayCount) {
        $('.new-answer').before(generateAnswerBox(answer));
    }
}
function insertFirstOrderedUnreviewedAnswer(answers) {
    if (answers === undefined || answers === null || answers.length === 0) {
        return;
    }
    else {
        answers.sort(function (a, b) {
            return b.upVotes - a.upVotes;
        });
        for (var i = 0; i < answers.length; i++) {
            if (!hasAnswerAlreadyBeenReviewed(answers[i])) {
                insertAnswer(answers[i]);
                break;
            }
        }
    }
}

function insertQuestion(question) {
    if (countDisplayedNextQuestionCandidates() < config.maxDisplayCount) {
        $('.new-question-add').before(generateNextQuestionBox(question));
    }
}
function insertFirstOrderedUnreviewedQuestionCandidate(questions) {
    if (questions === undefined || questions === null || questions.length === 0) {
        return;
    }
    else {
        questions.sort(function (a, b) {
            return b.upVotes - a.upVotes;
        });
        for (var i = 0; i < questions.length; i++) {
            if (!hasQuestionCandidateAlreadyBeenReviewed(questions[i])) {
                insertQuestion(questions[i]);
                break;
            }
        }
    }
}

function getCurrentDisplayedQuestion() {
    return $("#currentQuestionText").text().trim();
}
function currentDisplayedQuestionIsEmpty() {
    return getCurrentDisplayedQuestion() === "";
}
function setCurrentQuestion(questionText) {
    $("#currentQuestionText").text(questionText);
}
function setPendingQuestionText() {
    setCurrentQuestion(config.pendingQuestionText);
}
function isCurrentQuestionPending() {
    return getCurrentDisplayedQuestion() === config.pendingQuestionText;
}

function getCurrentQuestionId() {
    return $('#question-id').text();
}
function setCurrentQuestionId(questionId) {
    $('#question-id').text(questionId);
}
function clearCurrentQuestionId() {
    setCurrentQuestionId('');
}

function getCountDownTimerText() {
    return $('.countdown-timer').text().trim();
}
function setCountDownTimerText(secondsRemaining) {
    var minutes = Math.floor(secondsRemaining / 60);
    var seconds = secondsRemaining % 60;
    
    var minutesText = '00' + minutes;
    minutesText= minutesText.substring(minutesText.length - 2);
    var secondsText = '00' + seconds;
    secondsText = secondsText.substring(secondsText.length - 2);
    $('.countdown-timer').text(minutesText + ':' + secondsText);
}
function setCountDownTimerTextFromQuestion(question, totalQuestionDisplayTimeMinutes) {
    var currentSecondsRemaining = getRemainingSeconds(question, totalQuestionDisplayTimeMinutes);
    setCountDownTimerText(currentSecondsRemaining);
}
function countDownTimerIsEmpty() {
    return getCountDownTimerText() === "";
}
function getCountDownTimerSeconds() {
    var timerText = getCountDownTimerText();
    var indexOfColon = timerText.indexOf(':');
    var minutes = parseInt(timerText.substring(0, indexOfColon), 0);
    var seconds = parseInt(timerText.substring(indexOfColon + 1), 0);
    
    return (minutes * 60) + seconds;
}
function setPendingCountdownTimerText() {
    $('.countdown-timer').text(config.pendingCountdownText);
}
function isCountdownTimerPending() {
    return getCountDownTimerText() === config.pendingCountdownText;
}

function countDisplayedAnswers() {
    return $('.answer').length;
}
function countDisplayedNextQuestionCandidates() {
    return $('.new-question').length;
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
    return answerIsCurrentlyDisplayed(answer) || objectIdIsCached(answer._id);
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
    return questionCandidateIsCurrentlyDisplayed(question) || objectIdIsCached(question._id);
}

function getAnswerInputText() {
    return $('#newAnswer').val();
}
function clearAnswerInputText() {
    $('#newAnswer').val('');
}
// at the moment, the answers will need to be a minimum 
// of minInputTextLength characters. This is subject to change
//
function isSubmittedInputValid(inputText) {
    if (inputText.length < config.minInputLength) {
        return false;
    }
    else {
        return true;
    }
}
function setAnswerInputError(answerText) {
    $('.new-answer').removeClass('has-success').addClass('has-error');
    $('.new-answer .error-block').text(
        'minimum of ' + config.minInputLength + ' characters required (current length: ' + 
        answerText.length + 
        ')');
    $('.new-answer .error-block').show();
}
function clearAnswerInputError() {
    $('.new-answer').removeClass('has-error');
    $('.new-answer .error-block').hide();
}
function setAnswerInputSuccess() {
    clearAnswerInputText();
    $('.new-answer').removeClass('has-error').addClass('has-success');
    $('.new-answer .error-block').text('successfully added answer!');
    $('.new-answer .error-block').show();
}
function clearAnswerInputSuccess() {
    $('.new-answer').removeClass('has-success');
    $('.new-answer .error-block').hide();
}

function getQuestionInputText() {
    return $('#newQuestion').val();
}
function clearQuestionInputText() {
    $('#newQuestion').val('');
}
function setQuestionInputError(questionText) {
    $('.new-question-add').removeClass('has-success').addClass('has-error');
    $('.new-question-add .error-block').text(
        'minimum of ' + config.minInputLength + ' characters required (current length: ' + 
        questionText.length + 
        ')');
    $('.new-question-add .error-block').show();
}
function clearQuestionInputError() {
    $('.new-question-add').removeClass('has-error');
    $('.new-question-add .error-block').hide();
}
function setQuestionInputSuccess() {
    clearQuestionInputText();
    $('.new-question-add').removeClass('has-error').addClass('has-success');
    $('.new-question-add .error-block').text('successfully added question!');
    $('.new-question-add .error-block').show();
}
function clearQuestionInputSuccess() {
    $('.new-question-add').removeClass('has-success');
    $('.new-question-add .error-block').hide();
}

function displayedAnswerCount() {
    return $('.answer').length;
}

function answerVoted() {
    var $voteElement = $(this);
    var answerObjectId = $voteElement.parent().next().find('.object-id').text();
    // we need to get the over-arching answer div to do a test to see 
    // if it has already been voted on, so that we don't duplicate 
    // vote before it is hidden
    //
    // if this answer has *already* been voted on, then take no action 
    // so as not to throw it off
    //
    var $answerElement = $voteElement.parent().parent();
    if (elementIsSelected($answerElement)) {
        return;
    }
    
    $voteElement.addClass('selected');
    
    // up vote handling
    //
    if ($voteElement.hasClass('glyphicon-chevron-up')) {
        upVoteAnswer(answerObjectId, function (answer) {
            var upVotesDisplay = $voteElement.parent().next().find('.up-votes');
            upVotesDisplay.text(parseInt(upVotesDisplay.text()) + 1);
            
            // now we can keep the voted answer here for a short time, but then 
            // we should remove it from the UI to make room for a new unreviewed 
            // answer
            //
            setTimeout(function() {
                // get the answer off of the page
                //
                removeAnswer(answerObjectId);
                // also cache the object id so we don't see
                // this answer again
                //
                cacheObjectId(answerObjectId);
                
                // insert an unreviewed answer if it exists
                //
                getCurrentQuestion(function (question) {
                    sortAnswersByUpVotes(question.answers);
                    if (countDisplayedAnswers() < 3) {
                        insertFirstOrderedUnreviewedAnswer(question.answers);
                    }
                });
            }, 500);
        });
    }
    // down vote handling
    //
    else {
        downVoteAnswer(answerObjectId, function (answer) {
            var downVotesDisplay = $voteElement.parent().next().find('.down-votes');
            downVotesDisplay.text(parseInt(downVotesDisplay.text()) + 1);
            
            // now we can keep the voted answer here for a short time, but then 
            // we should remove it from the UI to make room for a new unreviewed 
            // answer
            //
            setTimeout(function() {
                // get the answer off of the page
                //
                removeAnswer(answerObjectId);
                // also cache the object id so we don't see
                // this answer again
                //
                cacheObjectId(answerObjectId);
                
                // insert an unreviewed answer if it exists
                //
                getCurrentQuestion(function (question) {
                    sortAnswersByUpVotes(question.answers);
                    if (countDisplayedAnswers() < 3) {
                        insertFirstOrderedUnreviewedAnswer(question.answers);
                    }
                });
            }, 500);
        });
    }
}

function questionVoted() {
    var $voteElement = $(this);
    var questionObjectId = $voteElement.parent().next().find('.object-id').text();
    // we need to get the over-arching question div to do a test to see 
    // if it has already been voted on, so that we don't duplicate 
    // vote before it is hidden
    //
    // if this question has *already* been voted on, then take no action 
    // so as not to throw it off
    //
    var $questionElement = $voteElement.parent().parent();
    if (elementIsSelected($questionElement)) {
        return;
    }
    
    $voteElement.addClass('selected');
    
    // up vote handling
    //
    if ($voteElement.hasClass('glyphicon-chevron-up')) {
        upVoteQuestion(questionObjectId, function (question) {
            var upVotesDisplay = $voteElement.parent().next().find('.up-votes');
            upVotesDisplay.text(parseInt(upVotesDisplay.text()) + 1);
            
            // remove the voted question after a brief pause
            //
            setTimeout(function () {
                // get the question off of the page
                //
                removeQuestion(questionObjectId);
                // cache the object id so it doesn't 
                // appear again
                //
                cacheObjectId(questionObjectId);
                
                // insert an unreviewed next question candidate if 
                // it exists
                //
                getNextQuestionCandidates(function (questions) {
                    sortQuestionsByUpVotes(questions);
                    if (countDisplayedNextQuestionCandidates() < 3) {
                        insertFirstOrderedUnreviewedQuestionCandidate(questions);
                    }
                });
            }, 500);
        });
    }
    // down vote handling
    //
    else {
        downVoteQuestion(questionObjectId, function (question) {
            var downVotesDisplay = $voteElement.parent().next().find('.down-votes');
            downVotesDisplay.text(parseInt(downVotesDisplay.text()) + 1);
            
            // remove the question after a short time to make room 
            // for next question candidates
            //
            setTimeout(function () {
                // get the question off of the page
                //
                removeQuestion(questionObjectId);
                // cache the object id so it doesn't 
                // show up again
                //
                cacheObjectId(questionObjectId);
                
                // insert an unreviewed next question candidate if 
                // it exists
                //
                getNextQuestionCandidates(function (questions) {
                    sortQuestionsByUpVotes(questions);
                    if (countDisplayedNextQuestionCandidates() < 3) {
                        insertFirstOrderedUnreviewedQuestionCandidate(questions);
                    }
                });
            }, 500);
        });
    }
}

function removeAnswer(answerObjectId) {
    $('.answer:contains("' + answerObjectId + '")').remove();
}
function removeQuestion(questionObjectId) {
    $('.new-question:contains("' + questionObjectId + '")').remove();
}

function currentQuestionNonexistent() {
    $('#currentQuestionText').text('no current question, but ask one below!');
    $('.new-answer').hide();
}
function currentQuestionExists() {
    $('.new-answer').show();
}

function clearInputs() {
    clearAnswerInputError();
    clearAnswerInputText();
    clearQuestionInputError();
    clearQuestionInputText();
}


// ********************************************************
//                  Web Storage helpers
// ********************************************************

function localStorageIsAvailable() {
    return typeof(Storage) !== "undefined";
}

function objectIdIsCached(objectId) {
    if (localStorageIsAvailable()) {
        if (localStorage.objectIdList === undefined || localStorage.objectIdList === "") {
            // the local storage string doesn't exist, which would mean 
            // that the ObjectId is not cached
            //
            return false;
        }
        else {
            var objectIdList = JSON.parse(localStorage.objectIdList);
            if ($.inArray(objectId, objectIdList) >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

function cacheObjectId(objectId) {
    // we don't want to add duplicate ObjectId elements (primarily
    // to keep the bloat and unknown behavior at a minimum), so 
    // we will also first do a check to see if it already exists
    //
    if (localStorageIsAvailable() && !objectIdIsCached(objectId)) {
        var objectIdList = 
            localStorage.objectIdList === undefined || localStorage.objectIdList === "" ? [] : JSON.parse(localStorage.objectIdList);
        objectIdList.push(objectId);
        localStorage.objectIdList = JSON.stringify(objectIdList);
    }
}

function clearCachedObjectIdElements() {
    localStorage.objectIdList = "[]";
}

function elementIsSelected($votingItem) {
    return $votingItem.find('.selected').length > 0;
}

function clearAllAnswers() {
    $('.answer').remove();
}

function clearAllNextQuestionCandidates() {
    $('.new-question').remove();
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
        }
    );
}

function addQuestion(questionText, callback) {
    $.post(
        '/questions/next/',
        { questionText: questionText },
        function (question) {
            callback(question);
        }
    );
}

function upVoteAnswer(answerObjectId, callback) {
    $.post(
        '/questions/answers/upvote/' + answerObjectId,
        callback
    );
}

function downVoteAnswer(answerObjectId, callback) {
    $.post(
        '/questions/answers/downvote/' + answerObjectId,
        callback
    );
}

function upVoteQuestion(questionObjectId, callback) {
    $.post(
        '/questions/upvote/' + questionObjectId,
        callback
    );
}

function downVoteQuestion(questionObjectId, callback) {
    $.post(
        '/questions/downvote/' + questionObjectId,
        callback
    );
}

function getNoQuestionStartDate(callback) {
    $.get('/questions/noquestion/', callback);
}
function getSecondsRemainingWithNoQuestion(callback) {
    getNoQuestionStartDate(function (noQuestionStartDate) {
        var startDate = new Date(noQuestionStartDate);
        var nowDate = new Date();
        var secondsRemaining = (config.questionDurationMinutes * 60) - ((nowDate - startDate) / 1000);
        callback(secondsRemaining);
    });
}


// ********************************************************
//                  initial load
// ********************************************************

function initialLoadActions() {    
    $('#addAnswer').click(submitAnswer);
    $('#addQuestion').click(submitQuestion);
    $('.question').on('click', '.vote-button', answerVoted);
    $('.new-questions').on('click', '.vote-button', questionVoted);
    
    // do an initial hide on this error
    //
    clearAnswerInputError();
    clearQuestionInputError();
    
    runIterator();
}

function getRemainingSeconds(question, totalQuestionDisplayTimeMinutes) {
    var questionAskedDate = new Date(question.dateAsked);
    var nowDate = new Date();
    var currentSecondsRemaining = Math.floor((totalQuestionDisplayTimeMinutes * 60) - ((nowDate - questionAskedDate) / 1000));
    return currentSecondsRemaining;
}

function runIterator() {
    setInterval(
        function () {
            if (currentDisplayedQuestionIsEmpty() && !isCurrentQuestionPending()) {
                // we need to check here to see what the "no question condition" 
                // looks like. if there is undefined returned during the no question 
                // state then we need to use the else statement to populate the 
                // no-question-state information and behavio
                //
                setPendingQuestionText();
                getCurrentQuestion(function (question) {
                    if (question) {
                        setCurrentQuestion(question.text);
                        setCountDownTimerTextFromQuestion(question, config.questionDurationMinutes);
                    }
                    else {
                        // handle the possible situation where there is no current 
                        // question
                    }
                });
            }
            else {
                // there is already a currently displayed question, so we need 
                // to make a check to see if the question is still current
                if (countDownTimerIsEmpty() && !isCountdownTimerPending()) {
                    // if there is no timer data then we need to get the remaining
                    // time for the current question, as at this point it is already 
                    // determined that there is a currently displayed question
                    setPendingCountdownTimerText();
                    getCurrentQuestion(function (question) {
                        if (question) {
                            setCurrentQuestion(question.text);
                            setCountDownTimerTextFromQuestion(question, config.questionDurationMinutes);
                        }
                    });
                }
                else {
                    var currentCountdownTimerSeconds = getCountDownTimerSeconds();
                    
                    // decrement the seconds as this is the *new* time not the old
                    currentCountdownTimerSeconds--;
                    
                    // if there is no more time remaining then we need to smartly 
                    // retrieve the new question or no question info
                    if (currentCountdownTimerSeconds <= 0) {
                        setPendingQuestionText();
                        setPendingCountdownTimerText();
                        // here we need to somehow retrieve the CURRENT question id 
                        // and then continuously retrieve the next question id and 
                        // compare to make sure we aren't getting into a race condition 
                        // where we pull the current question and the question has yet 
                        // to cycle
                        // 
                        // also worth noting here is that if there is no next question 
                        // then we need to handle that condition accordingly
                    }
                    else if (currentCountdownTimerSeconds % config.refreshInterval === 0) {
                        // otherwise we need to see if we should "refresh" our countdown
                        // timer by pulling the current question and re-setting the timer 
                        // as we don't want to much of a variance between browser timer 
                        // and the actual remaining time of the question
                        getCurrentQuestion(function (question) {
                            if (question) {
                                setCurrentQuestion(question.text);
                                setCountDownTimerTextFromQuestion(question, config.questionDurationMinutes);
                            }
                        });
                    }
                    else {
                        setCountDownTimerText(currentCountdownTimerSeconds);
                    }
                }
                
                // there is a question displayed, so we need to make sure that we 
                // display answers and next question candidates
                if (countDisplayedAnswers() < config.maxDisplayCount) {
                    getCurrentQuestion(function (question) {
                        // do another check here as we don't want to contribute to 
                        // a race condition, and we also need to make sure that the 
                        // question has answers
                        if (countDisplayedAnswers() < config.maxDisplayCount && question.answers && question.answers.length > 0) {
                            insertFirstOrderedUnreviewedAnswer(question.answers);
                        }
                    });
                }
            }
            
            // no matter what, question or no question, we still need to check for next question candidates
            if (countDisplayedNextQuestionCandidates() < config.maxDisplayCount) {
                getNextQuestionCandidates(function (questions) {
                    if (questions && countDisplayedNextQuestionCandidates() < config.maxDisplayCount) {
                        insertFirstOrderedUnreviewedQuestionCandidate(questions);
                    }
                });
            }
        },
        1000
    );
}

function submitAnswer() {
    var answerText = getAnswerInputText();
    if (isSubmittedInputValid(answerText)) {
        // clear any error if it has it just in case
        //
        clearAnswerInputError();
        
        addAnswer(answerText, function (question) {
            setAnswerInputSuccess();
            setTimeout(clearAnswerInputSuccess, 5000);
        });
    }
    else {
        // answer submitted isn't valid
        //
        // we don't want to clear the input text in case 
        // the user just wants to append to what they 
        // already have
        //
        setAnswerInputError(answerText);
    }
}

function submitQuestion() {
    var questionText = getQuestionInputText();
    if (isSubmittedInputValid(questionText)) {
        clearQuestionInputError();
        
        // add the next candidate question
        //
        addQuestion(questionText, function (question) {
            setQuestionInputSuccess();
            setTimeout(clearQuestionInputSuccess, 5000);
        });
    }
    else {
        setQuestionInputError(questionText);
    }
}

$(function () {
    initialLoadActions();
});