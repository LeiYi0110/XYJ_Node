var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1",27017,{safe:true});
var db = new mongodb.Db('xyj',server);

var ObjectID = require('mongodb').ObjectID;


router.get('/android', function(req, res, next) {

    var collection = global.db.collection('android_app_version');

    collection.findOne(function(err, item) {
        if(item == null)
        {
            res.json({"status":1,"data":{}});
            return;
        }
        res.json({"status":1,"data":item});

    });
    

});


router.get('/download', function(req, res, next) {

    res.render('download');
    

});

module.exports = router;