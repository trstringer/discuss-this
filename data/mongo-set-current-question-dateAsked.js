var mongo = new Mongo();
var db = mongo.getDB('letsdiscuss');

db.questions.update(
    { isCurrent: true },
    { 
        $set: {
            dateAsked: new Date() 
        }
    }
);