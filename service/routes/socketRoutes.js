var mysql = require('mysql');
var Twitter = require('node-tweet-stream');
trackItems = ["Donald Trump","Hiliary Clinton","Ben Carson","Bernie Sanders"];
var socketList = [];
count = [0, 0, 0, 0, 0];

var connection = mysql.createConnection({
    host: 'sarat.cjg2e5d6lgpb.us-east-1.rds.amazonaws.com',
    user: 'sarat',
    password: 'sarat123',
    database: 'bigdata'

    });

connection.connect(function(err) {
    if (err) console.log(err);
});

var t = new Twitter({
    consumer_key: 'CNmBr0Rzqo5faQ37m8IsFPs5h',
    consumer_secret: 'pd6TRMw1cPSlc2pYGk4mjsLMJbnHxGLRd3RlcE03khg5F0lySM',
    token: '594524977-z0hygd5fOPZBjJDCNj0IjBGTXz5Tiu82fVenq1DV',
    token_secret: 'v0zLLIUq5slgrXR2xqZyeKBQ8VZOHxxw0Lf1MORH2b4fh'
});

trackItems.forEach(function(item) {
    t.track(item);
});


// real time updates
t.on('tweet', function(tweet) {
    //console.log("inside real time tweets");
    if (tweet.geo) {
        getKeyword = null;
        for (var i = 0; i < trackItems.length; i++) {
            if (tweet.text.indexOf(trackItems[i]) > -1) {
                getKeyword = trackItems[i];
                count[i]++;
                // console.log(count);  // for trending !!!
                break;
            }
        }
        if (getKeyword != null) {
            //console.log(getKeyword);
            socketList.forEach(function(socket) {
                var data = {
                    iD: tweet.id,
                    name: tweet.user.name,
                    language: tweet.lang,
                    latitude: tweet.geo.coordinates[0],
                    longitude: tweet.geo.coordinates[1],
                    text: tweet.text,
                    keyword: getKeyword,
                    sentiment:sentimentResult,
                };
                socket.emit('tweet', data);
            });
        }
    }
});

// Initial Tweets
module.exports = function(io) {

    io.on('connection', function(socket) {
        socketList.push(socket);
        var queryString = 'SELECT * FROM twitterWithGeo';
        var queryString = 'SELECT * FROM twitter';
        connection.query(queryString, function(error, rows) {
            if (error) {
                console.log(error);
            } else {
                socket.emit('initialTweets', rows);
            }
        });


        socket.on('initialTweetsByTag', function(keyword) {
			var queryString;
            if (keyword == "") {
                queryString = "SELECT * FROM twitterWithGeo";
            } else {
                queryString = "SELECT * FROM twitterWithGeo where keyword='" + keyword + "'";
                queryString = "SELECT * FROM twitter";
            } else {
                queryString = "SELECT * FROM twitter where keyword='" + keyword + "'";
            }

            connection.query(queryString, function(error, rows) {
                if (error) {
                    console.log(error);
                } else {
                    socket.emit('initialTweetsByTag', rows);
                }
            });
        });
    });
};

t.on('error', function(err) {
    console.err(err);
});
