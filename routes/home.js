var express = require('express');
var router = express.Router();

//var mongodb = require('mongodb');
//var server = new mongodb.Server("120.25.207.34",27017,{safe:true});
//var db = new mongodb.Db('xyj',server);

var ObjectID = require('mongodb').ObjectID;

var resultDic = {};
var theme = new Array();

var area_id = 0;
var province = 0;

/*
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
var db_client;
//var collection_client;

var url = 'mongodb://xyj:xyj88283088@120.25.207.34:27017/xyj';
MongoClient.connect(url, {
        server: {
            poolSize: 10
        }
    }, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db_client = db;
        
    });
*/


router.get('/area_id/:area_id/province/:province', function(req, res, next) {
    
    //console.log(type of req.params.area_id);
    area_id = parseInt(req.params.area_id);
    province = parseInt(req.params.province);
    console.log("pre pre");
    var collection = global.db.collection('common_data');
            console.log("pre");
            collection.find({"area_id":area_id, "cover":{"$ne":""}},{"entity_id":1,"entity_type":1,"cover":1,"name":1,"gps":1,"address":1}).toArray(function(err,items)
            {
                if(items == null)
                {
                    res.json({"status":1,"data":resultDic});
                    return;
                }
                resultDic["focus_images"] = items;
                 //next();
                 //res.json(resultDic);
                var collectionTheme = global.db.collection('theme2');
                console.log("first");
                collectionTheme.find({"province":province},{"gps":0}).sort({"order":1}).toArray(function(err,items){
                    if(items == null)
                    {
                        res.json({"status":1,"data":resultDic});
                        return;
                    }
                    console.log("second");
                    resultDic["themes"] = items;
                
                    res.json({"status":1,"data":resultDic});
                });
               
            });

});


router.get('/area_id/:area_id/province/:province/startIndex/:startIndex/length/:length', function(req, res, next) {
    
    
    //console.log(type of req.params.area_id);
    area_id = parseInt(req.params.area_id);
    province = parseInt(req.params.province);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    console.log("pre pre");
    
    if (length > 10)
    {
        res.json({"status":0, "data":{},"message":"长度不能超过10"});
        return;
    }
   
    var collection = global.db.collection('common_data');
            console.log("pre");
            collection.find({"area_id":area_id, "cover":{"$ne":""}},{"entity_id":1,"entity_type":1,"cover":1,"name":1,"gps":1,"address":1}).toArray(function(err,items)
            {
                if(items == null)
                {
                    res.json({"status":1,"data":resultDic});
                    return;
                }
                resultDic["focus_images"] = items;
                 //next();
                var current_area_collection = global.db.collection('current_area');
                var collectionTheme = global.db.collection('theme');
                
                current_area_collection.findOne({"provinceId":province},function(err,item)
                {
                    if(item == null)
                    {
                        resultDic["themes"] = [];
                        res.json({"status":1,"data":resultDic});
                        return;
                    }
                    var theme_gps = item["gps"];
                    var latitude = parseFloat(theme_gps["latitude"]);
                    var longitude = parseFloat(theme_gps["longitude"]);
                    console.log(theme_gps);
                    console.log(latitude);
                    console.log(longitude);
                    //ObjectId("567fe57d9cbda0120d6f5c2e")
                    collectionTheme.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }} }},{"gps":0}).skip(startIndex).limit(length).toArray(function(err,items){
                        if(items == null)
                        {
                            resultDic["themes"] = [];
                            res.json({"status":1,"data":resultDic});
                            return;
                        }
                        console.log("second");
                        resultDic["themes"] = items;
                
                        res.json({"status":1,"data":resultDic});
                    });
                    
                });
                
               
               
            });
    

});


router.get('/special/area_id/:area_id/province/:province/startIndex/:startIndex/length/:length', function(req, res, next) {
    
    area_id = parseInt(req.params.area_id);
    province = parseInt(req.params.province);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    console.log("pre pre");
    
    if (length > 10)
    {
        res.json({"status":0, "data":{},"message":"长度不能超过10"});
        return;
    }
   
    var collection = global.db.collection('common_data');
            console.log("pre");
            collection.find({"area_id":area_id, "cover":{"$ne":""}},{"entity_id":1,"entity_type":1,"cover":1,"name":1,"gps":1,"address":1}).toArray(function(err,items)
            {
                if(items == null)
                {
                    res.json({"status":1,"data":resultDic});
                    return;
                }
                resultDic["focus_images"] = items;
                 //next();
                 
                 
                 
                 
                var current_area_collection = global.db.collection('current_area');
                var collectionTheme = global.db.collection('theme');
                
                current_area_collection.findOne({"provinceId":province},function(err,item)
                {
                    if(item == null)
                    {
                        resultDic["themes"] = [];
                        res.json({"status":1,"data":resultDic});
                        return;
                    }
                    var theme_gps = item["gps"];
                    var latitude = parseFloat(theme_gps["latitude"]);
                    var longitude = parseFloat(theme_gps["longitude"]);
                    console.log(theme_gps);
                    console.log(latitude);
                    console.log(longitude);
                    //ObjectId("567fe57d9cbda0120d6f5c2e")
                    //collectionTheme.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }} },"_id":{"$ne":ObjectID("567fe57d9cbda0120d6f5c2e")}},{"gps":0}).skip(startIndex).limit(length).toArray(function(err,items){
                      collectionTheme.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }} }},{"gps":0}).skip(startIndex).limit(length).toArray(function(err,items){
                        if(items == null)
                        {
                            resultDic["themes"] = [];
                            res.json({"status":1,"data":resultDic});
                            return;
                        }
                        console.log("second");
                        resultDic["themes"] = items;
                
                        res.json({"status":1,"data":resultDic});
                    });
                    
                });
                
               
               
            });
    
});
/*
router.get('/area_id/:area_id/province/:province',function(req, res, next) {
    
    //console.log(type of req.params.area_id);
    area_id = parseInt(req.params.area_id);
    province = parseInt(req.params.province);
    console.log("pre pre");
    
    //var url = 'mongodb://xyj:xyj88283088@120.25.207.34:27017/xyj';
    
    
    MongoClient.connect(url, {
        server: {
            poolSize: 10
        }
    }, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        db.close();
        res.json({"status":1, "data":[]});
    });
    

    
    var collection = db_client.collection('area');
            console.log(0);
            console.log(collection);
            collection.find().toArray(function(err,items)
            {
                console.log(1);
                var status = 0;
                if(!err)
                {
                    status = 1;
                }
                else
                {
                    console.log(err);
                }
                res.json({"status":status,"data":items}); 
            });
     
    
   
    

}

);
*/

/*
router.get('/testServer', function(req, res, next) {
    
    //console.log(type of req.params.area_id);
    area_id = parseInt(req.params.area_id);
    province = parseInt(req.params.province);
    console.log("pre pre");
    
    db.open(function(err, db) {
        db.authenticate('xyj', 'xyj88283088', function(err, result) {
            console.log("Connected correctly to server");

            res.json({"status":1, "data":[]});
        });
    });
    

}
);
*/



module.exports = router;
