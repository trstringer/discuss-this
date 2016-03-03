// ********************************************************
//                  Configuration
// ********************************************************

var config = {
    itemDuration: 7,
    minQuestionLength: 10,
    minAnswerLength: 2,
    maxDisplayCount: 3,
    refreshInterval: 10,
    noCurrentQuestionText: 'no current question, but ask one below!',
    nearingEndOfDurationBufferSeconds: 20,
    recentlyAnsweredQuestionsDisplayCount: 5
};


// ********************************************************
//                  UI helpers
// ********************************************************

function scrollToRecent() {
    $('html, body').animate({
        scrollTop: $('.recent').offset().top
    }, 1000);
}

function hideScrollToRecent() {
    $('#showRecentQuestions').hide();
}
function showScrollToRecent() {
    $('#showRecentQuestions').show();
}

function generateRecentQuestionBox(question) {
    return "<div class='col-xs-12 recent-container'>" +
            "<h2 class='col-xs-12 col-md-10 recent-question'>" +
                question.text +
            "</h2>" +
            "<h3 class='col-xs-12 col-md-10 recent-answer'>" +
                question.answers[0].text +
            "</h3>" + 
            "<div class='col-xs-3 col-md-3 archived-object-id'>" + question._id + "</div>" +
        "</div>";
}

function getAllRecentDisplayedQuestionsId() {
  var allIds = [];
  $('.recent-container .archived-object-id').each(function () {
    allIds.push($(this).text());
  });
  
  return allIds;
}
function isRecentQuestionDisplayed(question) {
  return $.inArray(question._id, getAllRecentDisplayedQuestionsId()) >= 0;
}

function addRecentQuestion(question, addToTop) {
    if (question && question.answers && question.answers.length > 0) {
      if (!isRecentQuestionDisplayed(question)) {
        if (addToTop) {
            // $('.recent').prepend(generateRecentQuestionBox(question));
            $(generateRecentQuestionBox(question)).insertAfter($('.recent h4'));
        }
        else {
            $('.recent').append(generateRecentQuestionBox(question));
        }
      }
    }
}

function countRecentDisplayedQuestions() {
    return $('.recent-question').length;
}

function removeOldestRecentQuestion() {
    $('.recent .recent-question:last-child').remove();
}

function generateAnswerBox(answer) {
    return "<div class='col-xs-12 col-md-12 answer voting-item'>" +
            "<div class='col-xs-2 col-md-1'>" +
                "<span class='glyphicon glyphicon-chevron-up vote-button'></span><br />" +
                "<span class='glyphicon glyphicon-chevron-down vote-button'></span>" +
            "</div>" +
            "<div class='col-xs-10 col-md-11'>" +
                "<div class='col-xs-12 col-md-11 votes'>" +
                    "<div class='col-xs-4 col-md-3'>" +
                        "<p class='up-votes'>" + answer.upVotes + "</p>" +
                    "</div>" +
                    "<div class='col-xs-4 col-md-3'>" +
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
                "<span class='glyphicon glyphicon-chevron-up vote-button'></span><br />" +
                "<span class='glyphicon glyphicon-chevron-down vote-button'></span>" +
            "</div>" +
            "<div class='col-xs-10 col-md-11'>" +
                "<div class='col-xs-12 col-md-11 votes'>" +
                    "<div class='col-xs-4 col-md-3'>" +
                        "<p class='up-votes'>" + question.upVotes + "</p>" +
                    "</div>" +
                    "<div class='col-xs-4 col-md-3'>" +
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
function setCurrentQuestion(question) {
    setCurrentQuestionText(question.text);
}
function setCurrentQuestionText(questionText) {
    $("#currentQuestionText").text(questionText);
}

function getCountDownTimerText() {
    return $('.countdown-timer').text().trim();
}
function setCountDownTimerTextBySeconds(secondsRemaining) {
    var minutes = Math.floor(secondsRemaining / 60);
    var seconds = secondsRemaining % 60;
    
    var minutesText = '00' + minutes;
    minutesText= minutesText.substring(minutesText.length - 2);
    var secondsText = '00' + seconds;
    secondsText = secondsText.substring(secondsText.length - 2);
    
    setCountDownTimerColor(secondsRemaining);
    $('.countdown-timer').text(minutesText + ':' + secondsText);
}
function setCountDownTimerColor(secondsRemaining) {
    if (secondsRemaining <= config.nearingEndOfDurationBufferSeconds && secondsRemaining > 0) {
        $('.countdown-timer').css('color', 'coral');
    }
    else if (secondsRemaining === 0) {
        $('.countdown-timer').css('color', 'lightgray');
    }
    else {
        $('.countdown-timer').css('color', 'darkgray');
    }
}
function setCountDownTimerTextFromQuestion(question, totalQuestionDisplayTimeMinutes) {
    var currentSecondsRemaining = getRemainingSeconds(question, totalQuestionDisplayTimeMinutes);
    setCountDownTimerTextBySeconds(currentSecondsRemaining);
}
function isCountdownTimerEmpty() {
    return $('.countdown-timer').text() === '';
}
function getCountDownTimerSeconds() {
    if (!isCountdownTimerEmpty()) {
        var timerText = getCountDownTimerText();
        var indexOfColon = timerText.indexOf(':');
        var minutes = parseInt(timerText.substring(0, indexOfColon), 0);
        var seconds = parseInt(timerText.substring(indexOfColon + 1), 0);
        
        return (minutes * 60) + seconds;
    }
    else {
        return null;
    }
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
function isSubmittedQuestionValid(inputText) {
    if (inputText.length < config.minQuestionLength) {
        return false;
    }
    else {
        return true;
    }
}
function isSubmittedAnswerValid(inputText) {
    if (inputText.length < config.minAnswerLength) {
        return false;
    }
    else {
        return true;
    }
}
function setAnswerInputError(answerText) {
    $('.new-answer').removeClass('has-success').addClass('has-error');
    $('.new-answer .error-block').text(
        'minimum of ' + config.minAnswerLength + ' characters required (current length: ' + 
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
        'minimum of ' + config.minQuestionLength + ' characters required (current length: ' + 
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

function isNoCurrentQuestion() {
    return $('#currentQuestionText').text() === config.noCurrentQuestionText;
}
function currentQuestionNonexistent() {
    $('#currentQuestionText').text(config.noCurrentQuestionText);
    hideAnswerInput();
}
function currentQuestionExists() {
    showAnswerInput();
}

function clearInputs() {
    clearAnswerInputError();
    clearAnswerInputText();
    clearQuestionInputError();
    clearQuestionInputText();
}

function hideAnswerInput() {
    $('.new-answer').hide();
}
function showAnswerInput() {
    $('.new-answer').show();
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

function getRecentlyAnsweredQuestions(count, callback) {
    $.getJSON('/questions/recent/' + count, function (questions) {
        callback(questions);
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


// ********************************************************
//                  initial load
// ********************************************************

function initialLoadActions() {    
    $('#addAnswer').click(submitAnswer);
    $('#addQuestion').click(submitQuestion);
    $('.question').on('click', '.vote-button', answerVoted);
    $('.new-questions').on('click', '.vote-button', questionVoted);
    $('#newAnswer').keypress(function (e) {
        if (e.keyCode === 13) {
            submitAnswer();
        }
    });
    $('#newQuestion').keypress(function (e) {
        if (e.keyCode === 13) {
            submitQuestion();
        }
    });
    $('.recent-message').click(scrollToRecent);
    $('.recent-remove').click(hideScrollToRecent);
    
    // initially hide the answer input box until 
    // we actually find out if there is an existing 
    // question
    hideAnswerInput();
    
    // initially hide scroll to recent
    hideScrollToRecent();
    
    // do an initial hide on this error
    //
    clearAnswerInputError();
    clearQuestionInputError();
    
    populateRecentlyAnsweredQuestions();
    
    runIterator();
}

function populateRecentlyAnsweredQuestions() {
    getRecentlyAnsweredQuestions(config.recentlyAnsweredQuestionsDisplayCount, function (questions) {
        if (questions && questions.length > 0) {
            for (var i = 0; i < questions.length; i++) {
                addRecentQuestion(questions[i]);
            }
        }
    });
}

function getRemainingSeconds(originDate, totalQuestionDisplayTimeMinutes) {
    var originDateObj = new Date(originDate);
    var nowDate = new Date();
    var currentSecondsRemaining = Math.floor((totalQuestionDisplayTimeMinutes * 60) - ((nowDate - originDateObj) / 1000));
    return currentSecondsRemaining;
}

function runIterator() {
    var isOperationOngoing = false;
    var currentQuestionId;
    var currentNoQuestionStartDate;
    var remainingSeconds;
    var isFirstPassNoQuestion = true;
    var isNewQuestion = false;
    
    setInterval(
        function () {
            // if there is no operation that is happening then we can do work
            
            // for the countdown doesn't appear "choppy" so let's assume a 
            // continuous countdown
            var onGoingSeconds = getCountDownTimerSeconds();
            if (onGoingSeconds > 0) {
                onGoingSeconds--;
                setCountDownTimerTextBySeconds(onGoingSeconds);
            }
            
            if (!isOperationOngoing) {
                isOperationOngoing = true;
                getCurrentQuestion(function (question) {
                    if (question) {
                        // a question exists, handle accordingly
                        currentNoQuestionStartDate = null;
                        isFirstPassNoQuestion = true;
                        
                        if (currentQuestionId) {
                            // if there is a currently stored question id then 
                            // we need to check to see if this question is a 
                            // new question or not
                            if (question._id !== currentQuestionId) {
                                // this is a new question
                                isNewQuestion = true;
                                clearAllAnswers();
                                clearAllNextQuestionCandidates();
                                setCurrentQuestion(question);
                                currentQuestionId = question._id;
                                currentQuestionExists();
                                addLastQuestionToMostRecentQuestions();
                                
                                // if there is a new question then we should show 
                                // the scroll to recent bar
                                showScrollToRecent();
                            }
                            else {
                                // this is the same question
                                isNewQuestion = false;
                            }
                        }
                        else {
                            // this is a new question when there was either a page 
                            // load or coming off of a no question condition
                            isNewQuestion = true;
                            clearAllAnswers();
                            clearAllNextQuestionCandidates();
                            setCurrentQuestion(question);
                            currentQuestionId = question._id;
                            currentQuestionExists();
                        }
                        
                        // set the countdown timer text appropriately
                        if (question.remainingTime === 0) {
                            hideAnswerInput();
                        }
                        
                        if (Math.abs(getCountDownTimerSeconds() - question.remainingTime) > 1) {
                            setCountDownTimerTextBySeconds(question.remainingTime);
                        }
                        
                        // make sure we're adding displayed answers if the max view 
                        // count isn't displayed and also if there are answers to display 
                        // as well as if we haven't reached the end of the countdown timer
                        if (displayedAnswerCount() < config.maxDisplayCount && question.answers && question.remainingTime > 0) {
                            insertFirstOrderedUnreviewedAnswer(question.answers);
                        }
                        
                        // no matter whether there is a current question or not we 
                        // need to continuously poll next question candidates so 
                        // that we are filling this
                        if (countDisplayedNextQuestionCandidates() < config.maxDisplayCount && !isNewQuestion) {
                            getNextQuestionCandidates(function (questions) {
                                insertFirstOrderedUnreviewedQuestionCandidate(questions);
                                // we have finished this operation so for this iteration 
                                // there is nothing else to do
                                isOperationOngoing = false;
                            });
                        }
                        else {
                            // we have filled all next question candidate slots so 
                            // there is nothing else to do
                            isOperationOngoing = false;
                        }
                    }
                    else {
                        // use this first pass as a buffer to prevent the change of 
                        // a new question instead of showing quickly no question when 
                        // in fact there is an actual question
                        if (isFirstPassNoQuestion) {
                            // lets delay for 5 seconds so we don't get a false 
                            // negative here
                            setCurrentQuestionText('attempting to retrieve question...');
                            hideAnswerInput();
                            clearAllAnswers();
                            clearAllNextQuestionCandidates();
                            setTimeout(function() {
                                isOperationOngoing = false;
                                isFirstPassNoQuestion = false;
                            }, 5000);
                        }
                        else {
                            // there is no current question
                            if (currentQuestionId) {
                                currentQuestionId = null;
                                clearAllNextQuestionCandidates();
                                
                                addLastQuestionToMostRecentQuestions();
                                showScrollToRecent();
                            }
                            
                            currentQuestionNonexistent();
                            clearAllAnswers();
                            
                            getNoQuestionStartDate(function (noQuestion) {                                
                                if (currentNoQuestionStartDate) {
                                    if (noQuestion.noQuestionStartDate !== currentNoQuestionStartDate) {
                                        // if we are here then it must be a new iteration of a no 
                                        // question condition
                                        clearAllNextQuestionCandidates();
                                        currentNoQuestionStartDate = noQuestion.noQuestionStartDate;
                                    }
                                }
                                else {
                                    // this is the start to the *first* no question start date
                                    clearAllNextQuestionCandidates();
                                    currentNoQuestionStartDate = noQuestion.noQuestionStartDate;
                                }
                                
                                if (noQuestion.remainingTime === 0) {
                                    clearAllNextQuestionCandidates();
                                }
                                
                                if (Math.abs(getCountDownTimerSeconds() - noQuestion.remainingTime) > 1) {
                                    setCountDownTimerTextBySeconds(noQuestion.remainingTime);
                                }
                                
                                // no matter whether there is a current question or not we 
                                // need to continuously poll next question candidates so 
                                // that we are filling this
                                if (countDisplayedNextQuestionCandidates() < config.maxDisplayCount) {
                                    getNextQuestionCandidates(function (questions) {
                                        insertFirstOrderedUnreviewedQuestionCandidate(questions);
                                        // we have finished this operation so for this iteration 
                                        // there is nothing else to do
                                        isOperationOngoing = false;
                                    });
                                }
                                else {
                                    // we have filled all next question candidate slots so 
                                    // there is nothing else to do
                                    isOperationOngoing = false;
                                }
                            });
                        }
                    }                    
                });
            }
        },
        1000
    );
}

function addLastQuestionToMostRecentQuestions() {
    getRecentlyAnsweredQuestions(1, function (questions) {
        if (questions && questions.length > 0) {
            addRecentQuestion(questions[0], true);
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
    if (isSubmittedQuestionValid(questionText)) {
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
    // make sure we aren't caching any calls
    $.ajaxSetup({cache: false});
    
    initialLoadActions();
});