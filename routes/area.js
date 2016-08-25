var express = require('express');
var router = express.Router();

//var mongodb = require('mongodb');
//var server = new mongodb.Server("127.0.0.1",27017,{safe:true});
var db = global.db;//new mongodb.Db('xyj',server);

var ObjectID = require('mongodb').ObjectID;

var longitude = 0;
var latitude = 0;
//var BSON = require('mongodb').BSONPure;
var resultDic = {};

//var cry = require('crypto');
router.get('/', function(req, res, next) {

     var collection = global.db.collection('current_area');

            collection.find().toArray(function(err,items)
            {
                var status = 0;
                if(!err)
                {
                    status = 1;
                }
                res.json({"status":status,"data":items}); 
            });
    /*  
    var filename = "Lei.Lei.Lei.jpg";
    var md5 = cry.createHash('md5');
    md5.update(filename);
    
    var d = md5.digest('hex');
    var filenames = filename.split(".");
     
    console.log(d + "." + filenames[filenames.length - 1]);
    */

  //res.render('index', { title: 'Express' });
});





module.exports = router;
