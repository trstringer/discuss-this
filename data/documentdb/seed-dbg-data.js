var DocumentClient = require('documentdb').DocumentClient;
var Guid = require('guid');

var docs = [
    {
        "id": Guid.raw(),
        "text": "do you think it will be a cold winter?",
        "upVotes" : 153,
        "downVotes" : 16,
        "isCurrent" : false,
        "isNextPossibility" : true,
        "dateCreated": new Date()
    },
    {
        "id": Guid.raw(),
        "text" : "what color is a lion?",
        "upVotes" : 23,
        "downVotes" : 4,
        "isCurrent" : true,
        "isNextPossibility" : false,
        "dateCreated": new Date(),
        "dateAsked": new Date(),
        "answers": [
            {
                "id": Guid.raw(),
                "text": "definitely orange-ish",
                "upVotes": 53,
                "downVotes": 2,
                "dateCreated": new Date()
            },
            {
                "id": Guid.raw(),
                "text": "I think more like yellow orange",
                "upVotes": 2587,
                "downVotes": 253,
                "dateCreated": new Date()
            },
            {
                "id": Guid.raw(),
                "text": "i would say light brown for sure",
                "upVotes": 4,
                "downVotes": 16246,
                "dateCreated": new Date()
            },
            {
                "id": Guid.raw(),
                "text": "let's go with brown-orange-yellow",
                "upVotes": 61236,
                "downVotes": 2326,
                "dateCreated": new Date()
            },
            {
                "id": Guid.raw(),
                "text": "i don't care...",
                "upVotes": 152,
                "downVotes": 18347,
                "dateCreated": new Date()
            },
            {
                "id": Guid.raw(),
                "text": "lions are most definitely a large array of colors",
                "upVotes": 152352,
                "downVotes": 65601,
                "dateCreated": new Date()
            }
        ]
    },
    {
        "id": Guid.raw(),
        "text" : "do you think we'll have flying cars in 20 years?",
        "upVotes" : 167,
        "downVotes" : 236,
        "isCurrent" : false,
        "isNextPossibility" : true,
        "dateCreated": new Date()
    },
    {
        "id": Guid.raw(),
        "text" : "how many gallons of water does the ocean have?",
        "upVotes" : 53,
        "downVotes" : 24,
        "isCurrent" : false,
        "isNextPossibility" : true,
        "dateCreated": new Date()
    },
    {
        "id": Guid.raw(),
        "text" : "what is the best city to live in?",
        "upVotes" : 1523,
        "downVotes" : 62,
        "isCurrent" : false,
        "isNextPossibility" : false,
        "dateCreated": new Date(),
        "answers": [
            {
                "id": Guid.raw(),
                "text": "definitely New York City.",
                "upVotes": 2612,
                "downVotes": 253,
                "dateCreated": new Date()
            },
            {
                "id": Guid.raw(),
                "text": "I would say San Francisco",
                "upVotes": 523,
                "downVotes": 426,
                "dateCreated": new Date()
            },
            {
                "id": Guid.raw(),
                "text": "Miami, most definitely no question about it.",
                "upVotes": 1624,
                "downVotes": 755,
                "dateCreated": new Date()
            }
        ]
    },
    {
        "id": Guid.raw(),
        "text" : "who sells the best cheeseburger?",
        "upVotes" : 12629,
        "downVotes" : 4,
        "isCurrent" : false,
        "isNextPossibility" : false,
        "dateCreated": new Date(),
        "answers": [
            {
                "id": Guid.raw(),
                "text": "Tommy's burger.",
                "upVotes": 75,
                "downVotes": 26,
                "dateCreated": new Date()
            },
            {
                "id": Guid.raw(),
                "text": "Big burger.",
                "upVotes": 462,
                "downVotes": 95,
                "dateCreated": new Date()
            }
        ]
    },
    {
        "id": Guid.raw(),
        "text" : "what is the best month of the year?",
        "upVotes" : 16246,
        "downVotes" : 253,
        "isCurrent" : false,
        "isNextPossibility" : true,
        "dateCreated": new Date()
    }
];

var client = new DocumentClient(
    '... sensitive data removed ...',
    {masterKey: '... sensitive data removed ...'}
);


client.queryDatabases({query: 'SELECT * FROM root r WHERE r.id = @id', parameters: [{name: '@id', value: 'letsdiscuss'}]})
    .nextItem(function (err, element) {
        var dbLink = element._self;
        client.queryCollections(dbLink, {query: 'SELECT * FROM root r WHERE r.id = @id', parameters: [{name: '@id', value: 'questions'}]})
            .nextItem(function (err, element) {
                var collLink = element._self;
                console.log('deleteing all documents...');
                client.queryDocuments(collLink, 'SELECT * FROM root r')
                    .forEach(function (err, element) {
                        if (element) {
                            client.deleteDocument(element._self, function (err, res) {
                                if (err) {
                                    console.log('ERROR :: ' + err.body);
                                }
                                else {
                                    console.log('SUCCESS :: ' + element.text);
                                }
                            });
                        }
                        else if (!element && !err) {
                            for (var i = 0; i < docs.length; i++) {
                                client.createDocument(collLink, docs[i], function (err) {
                                    if (err) {
                                        console.log('ERROR :: ' + err.body);
                                    }
                                    else {
                                        console.log('SUCCESSFUL INSERT OF QUESTION');
                                    }
                                });
                            }
                        }
                    });
            });
    });
   
