'use strict';

var Twitter = require('node-tweet-stream');
var t = new Twitter({
    consumer_key: '<consumer_key>',
    consumer_secret: '<consumer_secret>',
    token: '<consumer_token>',
    token_secret: '<consumer_secret>'
});

var trackItems = ['Donald Trump', 'Hillary Clinton', 'Martin Malley',
    'Bernie Sanders', 'Jeb Bush', 'Ben Carson', 'Chris Christie', 'Ted Cruz', 'Carly Fiorina',
    'Jim Gilmore', 'Lindsey Graham', 'Mike Huckabee', 'John Kasich', 'George Pataki', 'Rand Paul',
    'Marco Rubio', 'Rick Santorum', 'US Elections', 'USA Elections', 'US Elections 16', 'elections2016',
    'refugee', 'syrian'
];

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '<host name>',
    user: '<username>',
    password: '<password>',
    database: '<put database name here>'
});

connection.connect(function(err) {
    if (err) console.log(err);
});

var alchemyAPI = require('alchemy-api');
var alchemy = new alchemyAPI('851a942f3579a494707b3a09a6e98b841de7257f');

var getKeyword;

trackItems.forEach(function(item) {
    t.track(item);
});

var express = require("express");
var router = express.Router();


function putIntoDB(key, tweet, sentimentResult) {

    var data = {
        tweet_id: tweet.id,
        name: tweet.user.screen_name,
        followers_count: tweet.user.followers_count,
        friends_count: tweet.user.friends_count,
        status_count: tweet.user.statuses_count,
        profile_created_at: tweet.user.created_at,
        language: tweet.lang,
        tweet_created_at: tweet.created_at,
        text: tweet.text,
        retweet_count: tweet.retweet_count,
        keyword: key,
        sentiment: sentimentResult
    }
    console.log('Successfully finished parsing');

    connection.query('INSERT INTO twitter SET ?', data, function(err, result) {
        if (err) {
            console.log('ERROR OCCURED!! EXITING');
        } else {
            console.log('SUCCESS!!');
        }
    });
}

t.on('tweet', function(tweet) {
    getKeyword = null;
    for (var i = 0; i < trackItems.length; i++) {
        if (tweet.text.indexOf(trackItems[i]) > -1) {
            getKeyword = trackItems[i];
            console.log('Tweet collected !');
            alchemy.sentiment(tweet.text, {}, function(err, result) {
                var temp = JSON.stringify(result.docSentiment);
                putIntoDB(getKeyword, tweet, temp);
            });
        }
    }

});


t.on('error', function(err){
    console.log('Error!!!');
});
