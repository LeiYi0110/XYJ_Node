var express = require('express');
var router = express.Router();

//var mongodb = require('mongodb');
//var server = new mongodb.Server("127.0.0.1",27017,{safe:true});
//var db = new mongodb.Db('xyj',server);

var ObjectID = require('mongodb').ObjectID;

var longitude = 0;
var latitude = 0;
//var BSON = require('mongodb').BSONPure;
var resultDic = {};
var maxDistance = 20000;


router.get('/longitude/:longitude/latitude/:latitude/startIndex/:startIndex/length/:length', function(req, res, next) {
    
    //console.log(type of req.params.area_id);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    var longitude = parseFloat(req.params.longitude);
    var latitude = parseFloat(req.params.latitude);
    console.log(typeof req.params.area_id);
    if (length > 10)
    {
        res.json({"status":0, "data":[],"message":"长度不能超过10"});
        return;
    }
    var collection = global.db.collection('common_data');
    collection.find({"gps":{"$near":[latitude,longitude]},"cover":{"$ne":""}}).skip(startIndex).limit(length).toArray(function(err,items)
    {
       res.json({"status":1,"data":items}); 
    });
    

  //res.render('index', { title: 'Express' });
});

router.get('/hotel_count/longitude/:longitude/latitude/:latitude', function(req, res, next) {
    
    var longitude = parseFloat(req.params.longitude);
    var latitude = parseFloat(req.params.latitude);
    var collection = global.db.collection('hotel');
    //{"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }, "$maxDistance": 20000} }, "cover":{"$ne":""}}
    //collection.find({"gps":{"$within":{"$center": [[latitude,longitude],1]}}, "cover":{"$ne":""}},{"cover":1}).toArray(function(err, items) {
    collection.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }, "$maxDistance": maxDistance} }, "cover":{"$ne":""}},{"cover":1}).toArray(function(err, items) {
        console.log(items);
        var nearHotelDic = {};
                
        if(items != null && items.length > 0)
        {
            nearHotelDic["count"] = items.length;
            nearHotelDic["cover"] = items[0]["cover"];
        }
        else
        {
            nearHotelDic["count"] = 0;
            nearHotelDic["cover"] = "";
        }
                
        res.json({"status":1,"data":nearHotelDic})
    });
    

  //res.render('index', { title: 'Express' });
});

router.get('/restaurant_count/longitude/:longitude/latitude/:latitude', function(req, res, next) {
    
    var longitude = parseFloat(req.params.longitude);
    var latitude = parseFloat(req.params.latitude);
    var collection = global.db.collection('restaurant');
            
    collection.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }, "$maxDistance": maxDistance} }, "cover":{"$ne":""}},{"cover":1}).toArray(function(err, items) {
        console.log(items);
        var nearRestaurantDic = {};
                
        if(items != null && items.length > 0)
        {
            nearRestaurantDic["count"] = items.length;
            nearRestaurantDic["cover"] = items[0]["cover"];
        }
        else
        {
            nearRestaurantDic["count"] = 0;
            nearRestaurantDic["cover"] = "";
        }
                
        res.json({"status":1,"data":nearRestaurantDic});
    });
    

  //res.render('index', { title: 'Express' });
});

router.get('/sights_count/longitude/:longitude/latitude/:latitude', function(req, res, next) {
    
    var longitude = parseFloat(req.params.longitude);
    var latitude = parseFloat(req.params.latitude);
    var collection = global.db.collection('sights');
    collection.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }, "$maxDistance": maxDistance} }, "cover":{"$ne":""}},{"cover":1}).toArray(function(err, items) {
        console.log(items);
        var nearSightsDic = {};
        if(items != null && items.length > 0)
        {
            nearSightsDic["count"] = items.length;
            nearSightsDic["cover"] = items[0]["cover"];
        }
        else
        {
            nearSightsDic["count"] = 0;
            nearSightsDic["cover"] = "";
        }
                
        res.json({"status":1,"data":nearSightsDic});
    });
    

  //res.render('index', { title: 'Express' });
});

router.get('/sights_list/longitude/:longitude/latitude/:latitude/startIndex/:startIndex/length/:length', function(req, res, next) {
    
    var longitude = parseFloat(req.params.longitude);
    var latitude = parseFloat(req.params.latitude);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    
    if (length > 10)
    {
        res.json({"status":0, "data":[],"message":"长度不能超过10"});
        return;
    }
    //db.restaurants.find({ location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ -73.93414657, 40.82302903 ] }, $maxDistance: 5 * METERS_PER_MILE } } })
    console.log("sights_list");     
    var collection = global.db.collection('sights');
    collection.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }, "$maxDistance": maxDistance} }, "cover":{"$ne":""}},{"sights_desc": 0,"gps_sphere_3":0}).skip(startIndex).limit(length).toArray(function(err, items) {
        console.log(items);           
        res.json({"status":1,"data":items});
    });

});

router.get('/restaurant_list/longitude/:longitude/latitude/:latitude/startIndex/:startIndex/length/:length', function(req, res, next) {
    
    var longitude = parseFloat(req.params.longitude);
    var latitude = parseFloat(req.params.latitude);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    
    if (length > 10)
    {
        res.json({"status":0, "data":[],"message":"长度不能超过10"});
        return;
    }
    
    var collection = global.db.collection('restaurant');
            
    collection.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }, "$maxDistance": maxDistance} }, "cover":{"$ne":""}},{"restaurant_desc": 0,"gps_sphere_3":0}).skip(startIndex).limit(length).toArray(function(err, items) {
       console.log(items);                
       res.json({"status":1,"data":items});
    });

});

router.get('/hotel_list/longitude/:longitude/latitude/:latitude/startIndex/:startIndex/length/:length', function(req, res, next) {
    
 
    
    var longitude = parseFloat(req.params.longitude);
    var latitude = parseFloat(req.params.latitude);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    
    if (length > 10)
    {
        res.json({"status":0, "data":[],"message":"长度不能超过10"});
        return;
    }
    
    var collection = global.db.collection('hotel');
    
    
    collection.find({"gps_sphere_3":{ "$nearSphere": { "$geometry": { "type": "Point", "coordinates": [ longitude, latitude ] }, "$maxDistance": maxDistance} }, "cover":{"$ne":""}},{"hotel_desc": 0,"gps_sphere_3":0}).skip(startIndex).limit(length).toArray(function(err, items) {
        //console.log(items);
        res.json({"status":1,"data":items});
    });
    
   

});



module.exports = router;
