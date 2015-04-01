var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET twitter sentiment analysis home page. */
router.get('/twitter_sentiment', function(req, res) {
  res.render('twitter_sentiment', { title: 'Twitter Sentiment Analysis' });
});

module.exports = router;
