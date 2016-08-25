var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;


router.get("/restaurant/id/:id/startIndex/:startIndex/length/:length", function(req, res, next){
    var restaurant_comment = global.db.collection('restaurant_comment');
    var id = ObjectID(req.params.id);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    if (length > 10)
    {
        res.json({"status":0, "data":[],"message":"长度不能超过10"});
        return;
    }
    
    
    restaurant_comment.find({"restaurant_id":id}).skip(startIndex).limit(length).toArray(function(err, items) {
        if (err)
        {
            res.json({"status":0,"message":"数据库连接错误","data":[]});
            return;
        }
        if (items == null)
        {
            res.json({"status":1,"data":[]});
            return;
        }
        res.json({"status":1,"data":items});
    });

});

router.get("/hotel/id/:id/startIndex/:startIndex/length/:length", function(req, res, next){
    var hotel_comment = global.db.collection('hotel_comment');
    var id = ObjectID(req.params.id);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    if (length > 10)
    {
        res.json({"status":0, "data":[],"message":"长度不能超过10"});
        return;
    }
    
    
    hotel_comment.find({"hotel_id":id}).skip(startIndex).limit(length).toArray(function(err, items) {
        if (err)
        {
            res.json({"status":0,"message":"数据库连接错误","data":[]});
            return;
        }
        if (items == null)
        {
            res.json({"status":1,"data":[]});
            return;
        }
        res.json({"status":1,"data":items});
    });

});

router.get("/sights/id/:id/startIndex/:startIndex/length/:length", function(req, res, next){
    var sights_comment = global.db.collection('sights_comment');
    var id = ObjectID(req.params.id);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    if (length > 10)
    {
        res.json({"status":0, "data":[],"message":"长度不能超过10"});
        return;
    }
    
    
    sights_comment.find({"sights_id":id}).skip(startIndex).limit(length).toArray(function(err, items) {
        if (err)
        {
            res.json({"status":0,"message":"数据库连接错误","data":[]});
            return;
        }
        if (items == null)
        {
            res.json({"status":1,"data":[]});
            return;
        }
        res.json({"status":1,"data":items});
    });

});


module.exports = router;