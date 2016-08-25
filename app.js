var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var users = require('./routes/users');

var hotel = require('./routes/hotel2');

var restaurant = require('./routes/restaurant');
var sights = require('./routes/sights');

var nearby = require('./routes/nearby');
var home = require('./routes/home');
var area = require('./routes/area');
var my = require('./routes/my');
var search = require('./routes/search');

var comment = require('./routes/comment');

var shared = require('./routes/shared');
var tour_route = require('./routes/tour_route');
var version = require('./routes/version');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false, // don't create session until something stored
    resave: false,
    store: new MongoStore({
        // Basic usage
        host: '120.25.207.34', // Default, optional
        port: 27017, // Default, optional
        db: 'xyj', // Required

        // Basic authentication (optional)
        username: 'xyj',
        password: 'xyj88283088',

        // Advanced options (optional)
        autoReconnect: true, // Default
        w: 1, // Default,
        ssl: false // Default
    })
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


app.use('/hotel',hotel);
app.use('/restaurant',restaurant);
app.use('/sights',sights);

app.use('/nearby',nearby);
app.use('/home', home);
app.use('/area',area);

app.use('/my', my);
app.use('/search', search);

app.use('/comment', comment);

app.use('/shared', shared);

app.use('/tour_route',tour_route);
app.use('/version', version);

var imagePath = '/opt/productImage'   //'/Users/wanglei/Documents/images'
app.use(express.static(imagePath));///opt/productImage
///opt/headerImage/
app.use(express.static('/opt/headerImage'));
app.use(express.static('/opt/appDownload'));
app.use(express.static('/opt/commentImage'));

//app.use(express.cookieParser());

/*
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false, // don't create session until something stored
    resave: false,
    store: new MongoStore({
        url: 'mongodb://xyj:xyj88283088@120.25.207.34/xyj?authSource=admins&w=1',
        mongoOptions: advancedOptions // See below for details
    })
}));
*/

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


/*
app.use(function(req, res, next) {
  var sess = req.session
  if (sess.views) {
    sess.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + sess.views + '</p>')
    res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    sess.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})
*/

var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
//var db_client;
//var collection_client;

var url = 'mongodb://xyj:xyj88283088@120.25.207.34:27017/xyj';
//console.log(url)
MongoClient.connect(url, {
        server: {
            poolSize: 100
        }
    }, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        global.db = db;
        
    });


//var a = new Date();
//console.log(Date.now());
/*
var Range = 1000000 - 100000;   
var Rand = Math.random();   
var checkCode = 100000 + Math.round(Rand * Range);  

console.log(checkCode);
console.log("abc" + Date.now() + checkCode);
*/
  
module.exports = app;
