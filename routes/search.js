var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var server = new mongodb.Server("120.25.207.34",27017,{safe:true});
var db = new mongodb.Db('xyj',server);

var ObjectID = require('mongodb').ObjectID;

var resultData = new Array();
var longitude = 0;
var latitude = 0;
//var BSON = require('mongodb').BSONPure;
var resultDic = {};



router.get('/keyword/:keyword/startIndex/:startIndex/length/:length', function(req, res, next) {
    var keyword = req.params.keyword;
    //var label = parseInt(req.params.label);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    console.log(keyword);
    var collection = global.db.collection('common_data');
    collection.find({"cover":{"$ne":""},"$where":"this.name.indexOf('" + keyword + "') >= 0"}).skip(startIndex).limit(length).toArray(function(err, items) {
        res.json({"status":1, "data":items});
    }); 
});





module.exports = router;
