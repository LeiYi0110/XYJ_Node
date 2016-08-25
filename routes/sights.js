
var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1",27017,{safe:true});
var db = new mongodb.Db('xyj',server);

var ObjectID = require('mongodb').ObjectID;




router.get('/area_id/:area_id/startIndex/:startIndex/length/:length', function(req, res, next) {
    
    
    var area_id = parseInt(req.params.area_id);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    var count = 0;
    var area_collection = global.db.collection('current_area_data');
    var resultData = new Array();
    if (length > 10)
    {
        res.json({"status":0, "data":[],"message":"长度不能超过10"});
        return;
    }
    
    var collection = global.db.collection('sights');
    collection.count({"area_id":area_id},function(err, item) {
        //res.json({"status":0, "data":[],"message":"OK"});
        console.log("length");
        console.log(item)
        count = item;
        if (startIndex < item)
        {
            collection.find({"area_id":area_id, "cover":{"$ne":""}},{"sights_desc": 0}).skip(startIndex).limit(length).toArray(function(err, items) {
                
                if (items == null)
                {
                    res.json({"status":0, "data":[]});
                    return;
                }
                
                if (startIndex + length <= count){
                    res.json({"status":1, "data":items});
                    return;
                }
                resultData = items;
                console.log(1);
                area_collection.findOne({"area_id":area_id},function(err, item) {
                    if (item == null){
                        console.log(2);
                        res.json({"status":1,"data":resultData});
                        return; 
                    }
                    console.log(3);
                    var latitude = item.gps.latitude
                    var longitude = item.gps.longitude
 
                    console.log("latitude:" + latitude);
                    console.log("longitude:" + longitude);

                    collection.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }} },"cover":{"$ne":""},"area_id":{"$ne":area_id}},{"sights_desc": 0}).skip(0).limit(startIndex + length - count).toArray(function(err, items) {
                        //res.json({"status":1, "data":items});  
                        if (item == null){
                            console.log(4);
                            res.json({"status":1,"data":resultData});
                            return; 
                        }  
                        console.log(items.length);
                        for (var i = 0; i < items.length; i++)
                        {
                            console.log("internal");
                            resultData.push(items[i]);
                             console.log(resultData.length);
                        }
                        console.log(5);
                        res.json({"status":1,"data":resultData});
                        return;                   
                    });
                });             
            });

        }
        else
        {
            console.log("start out this area");
            area_collection.findOne({"area_id":area_id},function(err, item) {
                if (item == null){
                    res.json({"status":0,"data":[]});
                    return; 
                }
                var latitude = item.gps.latitude
                var longitude = item.gps.longitude
                
                console.log("latitude:" + latitude);
                console.log("longitude:" + longitude);

                collection.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }} },"cover":{"$ne":""},"area_id":{"$ne":area_id}},{"sights_desc": 0}).skip(startIndex - count).limit(length).toArray(function(err, items) {
                        //res.json({"status":1, "data":items});  
                    if (item == null){
                        res.json({"status":0,"data":[]});
                        return; 
                    }  

                    res.json({"status":1,"data":items});
                    return;                   
                });
            }); 
        }
        //return;
        
    });

    
  

});


router.get('/id/:id', function(req, res, next) {

    var collection = global.db.collection('sights');
    collection.findOne({"_id":ObjectID(req.params.id)},function(err, item) {
        if(item == null)
        {
            res.json({"status":1,"data":{}});
            return;
        }
        res.json({"status":1,"data":item});
                

    });
  }

);

router.get('/without/area_id/:area_id/startIndex/:startIndex/length/:length', function(req, res, next) {
    
    //console.log(type of req.params.area_id);
    var area_id = parseInt(req.params.area_id);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    console.log(typeof req.params.area_id);
    var area_collection = global.db.collection('current_area_data');
    console.log(1);
    area_collection.findOne({"area_id":area_id},function(err, item) {
        //res.json({"status":1, "data":items});
        if (item == null){
            res.json({"status":0,"data":[]});
            return; 
        }
        console.log(2);
        var collection = global.db.collection('sights');
        var latitude = item.gps.latitude
        var longitude = item.gps.longitude
        console.log("item gps");
        console.log(latitude);
        console.log(longitude);
        collection.find({"gps":{"$near":[latitude,longitude]},"cover":{"$ne":""},"area_id":{"$ne":area_id}},{"sights_desc": 0}).skip(startIndex).limit(length).toArray(function(err, items) {
            console.log(3);
            res.json({"status":1, "data":items});
            console.log(4);
        });
        
        
    });
});


module.exports = router;
