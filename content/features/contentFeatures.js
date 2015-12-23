'use strict';

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '<put host database address from AWS>',
    user: '<put your username here>',
    password: '<put password>',
    database: '<put database name>'
});

connection.connect(function(err) {
    if (err) console.log(err);
});
//Evaluating Alchemy API
var keyword = "Donald Trump";
var queryString;
var tweetText;
var count = 0;
var alchemyAPI = require('alchemy-api');
var alchemy = new alchemyAPI('<Put alchemy token here>');
var positiveSentimet = 0;
var negativeSentiment = 0;
var positiveCount = 0;
var negativeCount = 0;
var nuetralTweetsCount = 0
var ans;
var queryStringSentimet;
var temp;

// 1.Question Mark
// queryString = "SELECT text FROM twitter where keyword='" + keyword + "'";
// connection.query(queryString, function(error, rows) {
//     isQMark(rows);
// });

queryStringSentimet = "SELECT sentiment FROM twitter where keyword='" + keyword + "'";
connection.query(queryStringSentimet, function(error, rows) {
    getSentiment(rows);
});

function isQMark(rows) {
    rows.forEach(function(row) {
        tweetText = row.text;
        if (tweetText.indexOf("?") > -1) {
            count += 1;
        }
    });
    console.log('Total tweets with "?" is: ' + count);
}

// 2.Sentimet
function getSentiment(rows) {
    rows.forEach(function(row) {
        console.log(row);
    });
}

// 3.WordCount
