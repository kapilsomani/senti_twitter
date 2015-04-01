var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//Global variables
var twitter;
var twit;
var stream;

//bind server to a host and port
var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("twitter-sentiment-analyzer listening on http://127.0.0.1:" + port + "/twitter_sentiment");

function connect_twitter(){
  //connect to twitter
  console.log('Connecting to twitter with given credentials')
  twitter = require('ntwitter');
  //fill keys obtained from https://apps.twitter.com/app
	/*** Enter the twitter credentials ***/
  twit = new twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
  });
  twit
    .verifyCredentials(function (err, data) {
//    console.log(data);
    })
    .updateStatus('Test tweet from ntwitter/' + twitter.VERSION,
      function (err, data) {
//        console.log(data);
      }
   );
}

function analyze_senti(socket) {
  console.log('Analyzing love/hate sentiments!!');
  var love_count = 0;
  var hate_count = 0;
  twit.stream('statuses/filter',{track:['love','hate']}, function(stream) {
    stream.on('data', function (data) {
     // console.log(data.user.screen_name);
      if (data.text.indexOf('love') > -1)
      {
        love_count += 1;
        socket.emit('new-tweet',{avatar:data.user.profile_image_url, senti:'L', screen_name:data.user.screen_name, tweet_text:data.text,lc:love_count,hc:hate_count});
      }
      if (data.text.indexOf('hate') > -1)
      {
        hate_count += 1;
        socket.emit('new-tweet',{avatar:data.user.profile_image_url, senti:'H', screen_name:data.user.screen_name, tweet_text:data.text,lc:love_count,hc:hate_count});
      }
      console.log('Love:' + love_count + ' Hate:' + hate_count + '=>' + data.user.screen_name);
    });
    stream.on('end', function (response) {
      console.log('Stream end');
      // Handle a disconnection
    });
    stream.on('destroy', function (response) {
      console.log('Stream destroy');
      // Handle a 'silent' disconnection from Twitter, no end/error event fired
    });
    // Disconnect stream after five seconds
    // setTimeout(stream.destroy, 3000);
  });
}

//create a socket
var sio = require('socket.io').listen(server);
sio.sockets.on('connection',function(socket) {
  console.log('Web client connected');
  socket.emit('ss-confirmation',{text: 'Success'});
  connect_twitter();
  analyze_senti(socket);
  socket.on('disconnect',function() {
    console.log('Web client disconnected');
    console.log('**********************');
    console.log('**********************');
  });
});

module.exports = app;
