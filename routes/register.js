var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var server = new mongodb.Server("120.25.207.34",27017,{safe:true});
var db = new mongodb.Db('xyj',server);

var ObjectID = require('mongodb').ObjectID;

var longitude = 0;
var latitude = 0;
//var BSON = require('mongodb').BSONPure;
var resultDic = {};


var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var app = express();

    
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


router.post('/inputPhone', function(req, res, next) {
	console.log(req.body.phone);
    var phone = req.body.phone;
    var checkCode = req.body.checkCode;
    
    
    res.json({"status":1,"message":"验证成功"});
    /*
    db.open(function(err, db) {
        db.authenticate('xyj', 'xyj88283088', function(err, result) {
            var collection = db.collection('user');

            collection.insertOne({"phone":phone,"nickname":"","headerImage":"","email":"","address":""},function(err,result)
            {
                console.log(result);

            });

        });
    });
    */
    
    

});

router.post('/', function(req, res, next) {
    
/*
    var app = express();
    
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
    */
    /*
    var sess = req.session
  if (sess.views) {
    sess.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + sess.views + '</p>')
    res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
    console.log(sess.views);
    sess.username = "lei"
    console.log(sess.username);
    res.end();
  } else {
    sess.views = 1
    res.end('welcome to the session demo. refresh!');
  }
    
    */
    var phone = req.body.phone;
    var nickname = req.body.nickname;
    
    db.open(function(err, db) {
        db.authenticate('xyj', 'xyj88283088', function(err, result) {
            var collection = db.collection('user');
            collection.updateOne({})
            
            collection.insertOne({"phone":phone,"nickname":nickname,"headerImage":"","email":"","address":""},function(err,result)
            {
                //console.log(result);
                if(!err)
                {
                    //console.log(result.insertedId);
                    var sess = req.session;
                    sess.userId = result.insertedId;
                    console.log(result);
                    res.json({"status":1,"message":"注册成功"});
                }
                else{
                    res.json({"status":2,"message":"注册失败"});
                }
                

            });
            

        });
    });
    
    
});

router.get('/session', function(req, res, next) {

    var sess = req.session
    console.log(sess.username);
    res.send("OK");
    
});






module.exports = router;
