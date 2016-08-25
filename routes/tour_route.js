var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1",27017,{safe:true});
var db = new mongodb.Db('xyj',server);

var ObjectID = require('mongodb').ObjectID;


router.get('/id/:id', function(req, res, next) {

    var collection = global.db.collection('tour_route');

    collection.findOne({"_id":ObjectID(req.params.id)},function(err, item) {
        if(item == null)
        {
            res.json({"status":1,"data":{}});
            return;
        }
        res.json({"status":1,"data":item});

    });
    

});

router.get('/desc_file/id/:id',function(req, res, next){
    console.log("file");
    
    var collection = global.db.collection('tour_route');

    collection.findOne({"_id":ObjectID(req.params.id)},function(err, item) {
        
        if(item == null)
        {
            res.render('tour_desc_file', { image_url: "" });
            return;
        }
        res.render('tour_desc_file', {image_url: item["desc_file"]});

    });
    return;
    
});


module.exports = router;