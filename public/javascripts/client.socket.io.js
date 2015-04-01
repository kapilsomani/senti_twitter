var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);
console.log('Client: Connecting to server ' + server_name);

var love_count = 0;
var hate_count = 0;

function display_tweet(tweet) {
  var tweet_box;
  if(tweet.senti == 'L') {
    love_count = tweet.lc;
    tweet_box = document.getElementById('love-box').getElementsByTagName('ul')[0];
    document.getElementById('love-count').innerHTML = love_count;
  }
  if(tweet.senti == 'H') {
    hate_count = tweet.hc;
    tweet_box = document.getElementById('hate-box').getElementsByTagName('ul')[0];
    document.getElementById('hate-count').innerHTML = hate_count;
  }
  var tc = love_count + hate_count;
  var lp = (love_count)/tc * 100;
  var hp = 100.00 - lp;
  document.getElementById('total-count').innerHTML = tc;
  document.getElementById('love-perc').innerHTML = lp.toPrecision(4);
  document.getElementById('hate-perc').innerHTML = hp.toPrecision(4);
  var newtweet = document.createElement('li');
  newtweet.className += 'new-tweet';
  var avatar = document.createElement('div');
  avatar.className += 'avatar';
  var image = document.createElement('img');
  image.src = tweet.avatar;
  avatar.appendChild(image);
  newtweet.appendChild(avatar);
  var bubble = document.createElement('div');
  bubble.className += 'bubble-container';
  var new_twit = document.createElement('div');
  new_twit.className += 'tweet';
  var screen_name = document.createElement('screen_name');
  screen_name.appendChild(document.createTextNode('@' + tweet.screen_name));
  var tweet_text = document.createElement('tweet_text');
  tweet_text.appendChild(document.createTextNode(tweet.tweet_text));
  new_twit.appendChild(screen_name);
  new_twit.appendChild(tweet_text);
  bubble.appendChild(new_twit);
  newtweet.appendChild(bubble);
  //console.log(newtweet);
  var max_Length = 10;
  if(tweet_box.getElementsByTagName('li').length > max_Length)
  {
    //console.log(tweet_box.getElementsByTagName('li').length);
    tweet_box.removeChild(tweet_box.getElementsByTagName('li')[max_Length]);
  }
  //console.log(tweet_box.getElementsByTagName('li').length);
  tweet_box.insertBefore(newtweet,tweet_box.firstChild);
}

server.on('new-tweet',function(tweet) {
  //console.log(tweet);
  display_tweet(tweet);
});
