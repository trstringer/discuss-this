function scrollToRecent(){$("html, body").animate({scrollTop:$(".recent").offset().top},1e3)}function hideScrollToRecent(){$("#showRecentQuestions").hide()}function showScrollToRecent(){$("#showRecentQuestions").show()}function generateRecentQuestionBox(e){return"<div class='col-xs-12 recent-container'><h2 class='col-xs-12 col-md-10 recent-question'>"+e.text+"</h2><h3 class='col-xs-12 col-md-10 recent-answer'>"+e.answers[0].text+"</h3><div class='col-xs-3 col-md-3 archived-object-id'>"+e._id+"</div></div>"}function getAllRecentDisplayedQuestionsId(){}function isRecentQuestionDisplayed(e){}function addRecentQuestion(e,n){e&&e.answers&&e.answers.length>0&&(n?$(generateRecentQuestionBox(e)).insertAfter($(".recent h4")):$(".recent").append(generateRecentQuestionBox(e)))}function countRecentDisplayedQuestions(){return $(".recent-question").length}function removeOldestRecentQuestion(){$(".recent .recent-question:last-child").remove()}function generateAnswerBox(e){return"<div class='col-xs-12 col-md-12 answer voting-item'><div class='col-xs-2 col-md-1'><span class='glyphicon glyphicon-chevron-up vote-button'></span><br /><span class='glyphicon glyphicon-chevron-down vote-button'></span></div><div class='col-xs-10 col-md-11'><div class='col-xs-12 col-md-11 votes'><div class='col-xs-4 col-md-3'><p class='up-votes'>"+e.upVotes+"</p></div><div class='col-xs-4 col-md-3'><p class='down-votes'>"+e.downVotes+"</p></div><div class='col-xs-3 col-md-3 object-id'>"+e._id+"</div></div><div class='col-xs-12 col-md-11'><p>"+e.text+"</p></div></div></div>"}function generateNextQuestionBox(e){return"<div class='col-xs-12 col-md-12 new-question voting-item'><div class='col-xs-2 col-md-1'><span class='glyphicon glyphicon-chevron-up vote-button'></span><br /><span class='glyphicon glyphicon-chevron-down vote-button'></span></div><div class='col-xs-10 col-md-11'><div class='col-xs-12 col-md-11 votes'><div class='col-xs-4 col-md-3'><p class='up-votes'>"+e.upVotes+"</p></div><div class='col-xs-4 col-md-3'><p class='down-votes'>"+e.downVotes+"</p></div><div class='col-xs-3 col-md-3 object-id'>"+e._id+"</div></div><div class='col-xs-12 col-md-11'><p>"+e.text+"</p></div></div></div>"}function insertAnswer(e){countDisplayedAnswers()<config.maxDisplayCount&&$(".new-answer").before(generateAnswerBox(e))}function insertFirstOrderedUnreviewedAnswer(e){if(void 0!==e&&null!==e&&0!==e.length){e.sort(function(e,n){return n.upVotes-e.upVotes});for(var n=0;n<e.length;n++)if(!hasAnswerAlreadyBeenReviewed(e[n])){insertAnswer(e[n]);break}}}function insertQuestion(e){countDisplayedNextQuestionCandidates()<config.maxDisplayCount&&$(".new-question-add").before(generateNextQuestionBox(e))}function insertFirstOrderedUnreviewedQuestionCandidate(e){if(void 0!==e&&null!==e&&0!==e.length){e.sort(function(e,n){return n.upVotes-e.upVotes});for(var n=0;n<e.length;n++)if(!hasQuestionCandidateAlreadyBeenReviewed(e[n])){insertQuestion(e[n]);break}}}function getCurrentDisplayedQuestion(){return $("#currentQuestionText").text().trim()}function currentDisplayedQuestionIsEmpty(){return""===getCurrentDisplayedQuestion()}function setCurrentQuestion(e){setCurrentQuestionText(e.text)}function setCurrentQuestionText(e){$("#currentQuestionText").text(e)}function getCountDownTimerText(){return $(".countdown-timer").text().trim()}function setCountDownTimerTextBySeconds(e){var n=Math.floor(e/60),t=e%60,s="00"+n;s=s.substring(s.length-2);var o="00"+t;o=o.substring(o.length-2),setCountDownTimerColor(e),$(".countdown-timer").text(s+":"+o)}function setCountDownTimerColor(e){e<=config.nearingEndOfDurationBufferSeconds&&e>0?$(".countdown-timer").css("color","coral"):0===e?$(".countdown-timer").css("color","lightgray"):$(".countdown-timer").css("color","darkgray")}function setCountDownTimerTextFromQuestion(e,n){var t=getRemainingSeconds(e,n);setCountDownTimerTextBySeconds(t)}function isCountdownTimerEmpty(){return""===$(".countdown-timer").text()}function getCountDownTimerSeconds(){if(isCountdownTimerEmpty())return null;var e=getCountDownTimerText(),n=e.indexOf(":"),t=parseInt(e.substring(0,n),0),s=parseInt(e.substring(n+1),0);return 60*t+s}function countDisplayedAnswers(){return $(".answer").length}function countDisplayedNextQuestionCandidates(){return $(".new-question").length}function answerIsCurrentlyDisplayed(e){var n=[];return $(".answer .object-id").each(function(){n.push($(this).text())}),$.inArray(e._id,n)>=0?!0:!1}function hasAnswerAlreadyBeenReviewed(e){return answerIsCurrentlyDisplayed(e)||objectIdIsCached(e._id)}function questionCandidateIsCurrentlyDisplayed(e){var n=[];return $(".new-question .object-id").each(function(){n.push($(this).text())}),$.inArray(e._id,n)>=0?!0:!1}function hasQuestionCandidateAlreadyBeenReviewed(e){return questionCandidateIsCurrentlyDisplayed(e)||objectIdIsCached(e._id)}function getAnswerInputText(){return $("#newAnswer").val()}function clearAnswerInputText(){$("#newAnswer").val("")}function isSubmittedQuestionValid(e){return e.length<config.minQuestionLength?!1:!0}function isSubmittedAnswerValid(e){return e.length<config.minAnswerLength?!1:!0}function setAnswerInputError(e){$(".new-answer").removeClass("has-success").addClass("has-error"),$(".new-answer .error-block").text("minimum of "+config.minAnswerLength+" characters required (current length: "+e.length+")"),$(".new-answer .error-block").show()}function clearAnswerInputError(){$(".new-answer").removeClass("has-error"),$(".new-answer .error-block").hide()}function setAnswerInputSuccess(){clearAnswerInputText(),$(".new-answer").removeClass("has-error").addClass("has-success"),$(".new-answer .error-block").text("successfully added answer!"),$(".new-answer .error-block").show()}function clearAnswerInputSuccess(){$(".new-answer").removeClass("has-success"),$(".new-answer .error-block").hide()}function getQuestionInputText(){return $("#newQuestion").val()}function clearQuestionInputText(){$("#newQuestion").val("")}function setQuestionInputError(e){$(".new-question-add").removeClass("has-success").addClass("has-error"),$(".new-question-add .error-block").text("minimum of "+config.minQuestionLength+" characters required (current length: "+e.length+")"),$(".new-question-add .error-block").show()}function clearQuestionInputError(){$(".new-question-add").removeClass("has-error"),$(".new-question-add .error-block").hide()}function setQuestionInputSuccess(){clearQuestionInputText(),$(".new-question-add").removeClass("has-error").addClass("has-success"),$(".new-question-add .error-block").text("successfully added question!"),$(".new-question-add .error-block").show()}function clearQuestionInputSuccess(){$(".new-question-add").removeClass("has-success"),$(".new-question-add .error-block").hide()}function displayedAnswerCount(){return $(".answer").length}function answerVoted(){var e=$(this),n=e.parent().next().find(".object-id").text(),t=e.parent().parent();elementIsSelected(t)||(e.addClass("selected"),e.hasClass("glyphicon-chevron-up")?upVoteAnswer(n,function(t){var s=e.parent().next().find(".up-votes");s.text(parseInt(s.text())+1),setTimeout(function(){removeAnswer(n),cacheObjectId(n),getCurrentQuestion(function(e){sortAnswersByUpVotes(e.answers),countDisplayedAnswers()<3&&insertFirstOrderedUnreviewedAnswer(e.answers)})},500)}):downVoteAnswer(n,function(t){var s=e.parent().next().find(".down-votes");s.text(parseInt(s.text())+1),setTimeout(function(){removeAnswer(n),cacheObjectId(n),getCurrentQuestion(function(e){sortAnswersByUpVotes(e.answers),countDisplayedAnswers()<3&&insertFirstOrderedUnreviewedAnswer(e.answers)})},500)}))}function questionVoted(){var e=$(this),n=e.parent().next().find(".object-id").text(),t=e.parent().parent();elementIsSelected(t)||(e.addClass("selected"),e.hasClass("glyphicon-chevron-up")?upVoteQuestion(n,function(t){var s=e.parent().next().find(".up-votes");s.text(parseInt(s.text())+1),setTimeout(function(){removeQuestion(n),cacheObjectId(n),getNextQuestionCandidates(function(e){sortQuestionsByUpVotes(e),countDisplayedNextQuestionCandidates()<3&&insertFirstOrderedUnreviewedQuestionCandidate(e)})},500)}):downVoteQuestion(n,function(t){var s=e.parent().next().find(".down-votes");s.text(parseInt(s.text())+1),setTimeout(function(){removeQuestion(n),cacheObjectId(n),getNextQuestionCandidates(function(e){sortQuestionsByUpVotes(e),countDisplayedNextQuestionCandidates()<3&&insertFirstOrderedUnreviewedQuestionCandidate(e)})},500)}))}function removeAnswer(e){$('.answer:contains("'+e+'")').remove()}function removeQuestion(e){$('.new-question:contains("'+e+'")').remove()}function isNoCurrentQuestion(){return $("#currentQuestionText").text()===config.noCurrentQuestionText}function currentQuestionNonexistent(){$("#currentQuestionText").text(config.noCurrentQuestionText),hideAnswerInput()}function currentQuestionExists(){showAnswerInput()}function clearInputs(){clearAnswerInputError(),clearAnswerInputText(),clearQuestionInputError(),clearQuestionInputText()}function hideAnswerInput(){$(".new-answer").hide()}function showAnswerInput(){$(".new-answer").show()}function localStorageIsAvailable(){return"undefined"!=typeof Storage}function objectIdIsCached(e){if(localStorageIsAvailable()){if(void 0===localStorage.objectIdList||""===localStorage.objectIdList)return!1;var n=JSON.parse(localStorage.objectIdList);return $.inArray(e,n)>=0?!0:!1}}function cacheObjectId(e){if(localStorageIsAvailable()&&!objectIdIsCached(e)){var n=void 0===localStorage.objectIdList||""===localStorage.objectIdList?[]:JSON.parse(localStorage.objectIdList);n.push(e),localStorage.objectIdList=JSON.stringify(n)}}function clearCachedObjectIdElements(){localStorage.objectIdList="[]"}function elementIsSelected(e){return e.find(".selected").length>0}function clearAllAnswers(){$(".answer").remove()}function clearAllNextQuestionCandidates(){$(".new-question").remove()}function getCurrentQuestion(e){$.getJSON("/questions/",function(n){e(n)})}function getRecentlyAnsweredQuestions(e,n){$.getJSON("/questions/recent/"+e,function(e){n(e)})}function sortAnswersByUpVotes(e){void 0!==e&&null!==e&&0!==e.length&&e.sort(function(e,n){return e.upVotes>n.upVotes?-1:e.upVotes<n.upVotes?1:0})}function sortAnswersByDownVotes(e){void 0!==e&&null!==e&&0!==e.length&&e.sort(function(e,n){return e.downVotes>n.downVotes?-1:e.downVotes<n.downVotes?1:0})}function sortQuestionsByUpVotes(e){void 0!==e&&null!==e&&0!==e.length&&e.sort(function(e,n){return e.upVotes>n.upVotes?-1:e.upVotes<n.UpVotes?1:0})}function getNextQuestionCandidates(e){$.getJSON("/questions/next/0/",function(n){e(n)})}function addAnswer(e,n){$.post("/questions/answers/",{answerText:e},function(e){n(e)})}function addQuestion(e,n){$.post("/questions/next/",{questionText:e},function(e){n(e)})}function upVoteAnswer(e,n){$.post("/questions/answers/upvote/"+e,n)}function downVoteAnswer(e,n){$.post("/questions/answers/downvote/"+e,n)}function upVoteQuestion(e,n){$.post("/questions/upvote/"+e,n)}function downVoteQuestion(e,n){$.post("/questions/downvote/"+e,n)}function getNoQuestionStartDate(e){$.get("/questions/noquestion/",e)}function initialLoadActions(){$("#addAnswer").click(submitAnswer),$("#addQuestion").click(submitQuestion),$(".question").on("click",".vote-button",answerVoted),$(".new-questions").on("click",".vote-button",questionVoted),$("#newAnswer").keypress(function(e){13===e.keyCode&&submitAnswer()}),$("#newQuestion").keypress(function(e){13===e.keyCode&&submitQuestion()}),$(".recent-message").click(scrollToRecent),$(".recent-remove").click(hideScrollToRecent),hideAnswerInput(),hideScrollToRecent(),clearAnswerInputError(),clearQuestionInputError(),populateRecentlyAnsweredQuestions(),runIterator()}function populateRecentlyAnsweredQuestions(){getRecentlyAnsweredQuestions(config.recentlyAnsweredQuestionsDisplayCount,function(e){if(e&&e.length>0)for(var n=0;n<e.length;n++)addRecentQuestion(e[n])})}function getRemainingSeconds(e,n){var t=new Date(e),s=new Date,o=Math.floor(60*n-(s-t)/1e3);return o}function runIterator(){var e,n,t=!1,s=!0,o=!1;setInterval(function(){var i=getCountDownTimerSeconds();i>0&&(i--,setCountDownTimerTextBySeconds(i)),t||(t=!0,getCurrentQuestion(function(i){i?(n=null,s=!0,e?i._id!==e?(o=!0,clearAllAnswers(),clearAllNextQuestionCandidates(),setCurrentQuestion(i),e=i._id,currentQuestionExists(),addLastQuestionToMostRecentQuestions(),showScrollToRecent()):o=!1:(o=!0,clearAllAnswers(),clearAllNextQuestionCandidates(),setCurrentQuestion(i),e=i._id,currentQuestionExists()),0===i.remainingTime&&hideAnswerInput(),Math.abs(getCountDownTimerSeconds()-i.remainingTime)>1&&setCountDownTimerTextBySeconds(i.remainingTime),displayedAnswerCount()<config.maxDisplayCount&&i.answers&&i.remainingTime>0&&insertFirstOrderedUnreviewedAnswer(i.answers),countDisplayedNextQuestionCandidates()<config.maxDisplayCount&&!o?getNextQuestionCandidates(function(e){insertFirstOrderedUnreviewedQuestionCandidate(e),t=!1}):t=!1):s?(setCurrentQuestionText("attempting to retrieve question..."),hideAnswerInput(),clearAllAnswers(),clearAllNextQuestionCandidates(),setTimeout(function(){t=!1,s=!1},5e3)):(e&&(e=null,clearAllNextQuestionCandidates(),addLastQuestionToMostRecentQuestions(),showScrollToRecent()),currentQuestionNonexistent(),clearAllAnswers(),getNoQuestionStartDate(function(e){n?e.noQuestionStartDate!==n&&(clearAllNextQuestionCandidates(),n=e.noQuestionStartDate):(clearAllNextQuestionCandidates(),n=e.noQuestionStartDate),0===e.remainingTime&&clearAllNextQuestionCandidates(),Math.abs(getCountDownTimerSeconds()-e.remainingTime)>1&&setCountDownTimerTextBySeconds(e.remainingTime),countDisplayedNextQuestionCandidates()<config.maxDisplayCount?getNextQuestionCandidates(function(e){insertFirstOrderedUnreviewedQuestionCandidate(e),t=!1}):t=!1}))}))},1e3)}function addLastQuestionToMostRecentQuestions(){getRecentlyAnsweredQuestions(1,function(e){e&&e.length>0&&addRecentQuestion(e[0],!0)})}function submitAnswer(){var e=getAnswerInputText();isSubmittedAnswerValid(e)?(clearAnswerInputError(),addAnswer(e,function(e){setAnswerInputSuccess(),setTimeout(clearAnswerInputSuccess,5e3)})):setAnswerInputError(e)}function submitQuestion(){var e=getQuestionInputText();isSubmittedQuestionValid(e)?(clearQuestionInputError(),addQuestion(e,function(e){setQuestionInputSuccess(),setTimeout(clearQuestionInputSuccess,5e3)})):setQuestionInputError(e)}var config={itemDuration:1,minQuestionLength:10,minAnswerLength:2,maxDisplayCount:3,refreshInterval:10,noCurrentQuestionText:"no current question, but ask one below!",nearingEndOfDurationBufferSeconds:20,recentlyAnsweredQuestionsDisplayCount:5};$(function(){$.ajaxSetup({cache:!1}),initialLoadActions()});