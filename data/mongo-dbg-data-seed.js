var mongo = new Mongo();
var db = mongo.getDB('letsdiscuss');

// remove all of the documents to start with 
// a known state
//
db.questions.remove({});

// seed documents for testing
//
var documents = [
    {
        "text" : "do you think it will be a cold winter?",
        "upVotes" : 153,
        "downVotes" : 16,
        "isCurrent" : false,
        "isNextPossibility" : true,
        "answers": []
    },
    {
        "text" : "what color is a lion?",
        "upVotes" : 23,
        "downVotes" : 4,
        "isCurrent" : true,
        "isNextPossibility" : false,
        "answers": []
    },
    {
        "text" : "do you think we'll have flying cars in 20 years?",
        "upVotes" : 167,
        "downVotes" : 236,
        "isCurrent" : false,
        "isNextPossibility" : true,
        "answers": []
    },
    {
        "text" : "how many gallons of water does the ocean have?",
        "upVotes" : 53,
        "downVotes" : 24,
        "isCurrent" : false,
        "isNextPossibility" : true,
        "answers": []
    },
    {
        "text" : "what is the best city to live in?",
        "upVotes" : 1523,
        "downVotes" : 62,
        "isCurrent" : false,
        "isNextPossibility" : false,
        "answers": []
    },
    {
        "text" : "who sells the best cheeseburger?",
        "upVotes" : 12629,
        "downVotes" : 4,
        "isCurrent" : false,
        "isNextPossibility" : false,
        "answers": []
    }
];
db.questions.insert(documents);