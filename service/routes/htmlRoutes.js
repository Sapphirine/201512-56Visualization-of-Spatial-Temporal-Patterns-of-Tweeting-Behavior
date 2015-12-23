var express = require ("express");
var router = express.Router();


router.get('/', function(req, res){
	var data = 	{ // Change it
		Content: [				// ADD PHOTO HERE !!
		{
			ID: 1,
			name: "Shivam",
			language: "English",
			latitude: 41.22,
			longitude: 41.92,
			tweetTexts: "Big Data"
		},
		{
			ID: 2,
			name: "Sarat",
			language: "English",
			latitude: 6.10,
			longitude: 19.89,
			tweetTexts: "Bigger Big Data!"
		},
                {
			ID: 3,
			name: "Palash",
			language: "English",
			latitude: 7.10,
			longitude: 21.89,
			tweetTexts: "Double Bigger Big Data!"
		}
		]
	};
	return res.render('index', data);
});

router.get('/map', function(req,res){
	return res.render('map',{});
});

router.get('/heatmap', function(req,res){
	return res.render('heatmap',{});
});

module.exports = router;
