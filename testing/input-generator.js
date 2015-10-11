var http = require('http');

http.get(
    "http://localhost:3000/questions/",
    function (res) {
        var responseData = '';
        res.on('data', function (data) {
            responseData += data;
        });
        res.on('end', function () {
            console.log(JSON.parse(responseData));
        });
    }
);