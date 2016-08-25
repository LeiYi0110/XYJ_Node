var express = require('express');
var router = express.Router();

//var mongodb = require('mongodb');
//var server = new mongodb.Server("120.25.207.34",27017,{safe:true});
//var db = new mongodb.Db('xyj',server);

var ObjectID = require('mongodb').ObjectID;

var longitude = 0;
var latitude = 0;
//var BSON = require('mongodb').BSONPure;
var resultDic = {};


var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var ObjectID = require('mongodb').ObjectID;
var multiparty = require('multiparty');

var querystring = require('querystring');

var http = require('http');
var fs = require('fs');

var cry = require('crypto');

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


router.post('/register/inputPhone', function(req, res, next) {
	console.log(req.body.phone);
    var phone = req.body.phone;
    var checkCode = req.body.checkCode;
    var sess = req.session;
    
    if(phone == null){
        res.json({"status":0,"message":"电话不能为空"});
        return;
    }
    if(checkCode == null){
        res.json({"status":0,"message":"验证码不能为空"});
        return;
    }
    
    var collection = global.db.collection('user');
            
    collection.findOne({"phone":phone},function(err,item){
        console.log("item:");
        console.log(item);
                
        if(item != null)
        {
            res.json({"status":0,"message":"此电话已被注册过"});
        }
        else if(checkCode != null && parseInt(checkCode) == parseInt(sess.checkCode)){
            res.json({"status":1,"message":"验证成功"});
        }
        else{
            res.json({"status":0,"message":"输入验证码错误"});
        }

    });

    
    

});

router.post('/register', function(req, res, next) {
    

    var phone = req.body.phone;
    var nickname = req.body.nickname;
	var pwd = req.body.pwd;
    

    console.log("register phone:")
	console.log(phone);
    console.log(pwd);
    console.log(nickname);
    if(phone == null)
    {
        res.json({"status":0, "message":"电话不能为空"});
    }
    if(pwd == null)
    {
        res.json({"status":0, "message":"密码不能为空"});
    }
    if(nickname == null)
    {
        res.json({"status":0, "message":"昵称不能为空"});
    }
    
    var collection = global.db.collection('user');
            
    collection.findOne({"phone":phone},function(err,item){
        console.log("item:");
        console.log(item);
                
        if(item != null)
        {
            res.json({"status":0,"message":"此电话已被注册过"});
        }
        else
        {
            collection.insertOne({"phone":phone,"nickname":nickname, "pwd":pwd, "headerImage":"","email":"","address":""},function(err,result)
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
                    res.json({"status":0,"message":"注册失败"});
                }

             });
        }
              
    });
    
    
});

router.post('/login', function(req, res, next) {
	var phone = req.body.phone;
    //var nickname = req.body.nickname;
	var pwd = req.body.pwd;
    //var userId = "";
    console.log("login phone:")
	console.log(phone);
    console.log(pwd);
    if(phone == null)
    {
        res.json({"status":0, "message":"电话不能为空"});
    }
    if(pwd == null)
    {
        res.json({"status":0, "message":"密码不能为空"});
    }
	var collection = global.db.collection('user');
            //collection.updateOne({})
            
    collection.findOne({"phone":phone, "pwd":pwd},function(err,item)
    {
        console.log(item);
        if(item != null)
        {
            var sess = req.session;
                    //var userId = item["_id"]
            sess.userId = item["_id"];
            console.log("login");
            console.log(sess.userId);
            res.json({"status":1, "message":"登录成功", "data":item});
            return;
        }
        res.json({"status":0, "message":"登录失败", "data":{}});
        
    });
   
});


router.post('/logout', function(req, res, next) {
    var sess = req.session;
    sess.userId = null;
    console.log(sess.userId);
    res.json({"status":1, "message":"退出成功"});
});

router.post('/changePwd', function(req, res, next) {
    var oldPwd = req.body.oldPwd;
    var newPwd = req.body.newPwd;
    var sess = req.session;
    
    if(sess.userId == null)
    {
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    console.log("changePwd:");
    console.log(sess.userId);
    console.log(oldPwd);
    
    var collection = global.db.collection('user');
    collection.findOne({"_id":ObjectID(sess.userId)},function(err,item)
    {
        console.log(item);
        if(item != null)
        {
            if(item["pwd"] != oldPwd)
            {
                res.json({"status":0,"message":"密码错误"});
            }
            else
            {
                collection.updateOne({"_id":ObjectID(sess.userId)}, {$set:{"pwd":newPwd}},
                    function(err,result)
                    {
                        console.log(result);
                        res.json({"status":1,"message":"修改成功"});
                    });
                        
            }
        }
    });
    
    
    
    //var sess = req.session;
    //sess.userId = null;
});

router.post('/changeNickname', function(req, res, next) {
    var nickname = req.body.nickname;
    var sess = req.session;
    console.log(sess.userId);
    console.log(nickname);
    var collection = global.db.collection('user');
    collection.updateOne({"_id":ObjectID(sess.userId)}, {$set:{"nickname":nickname}},
       function(err,result)
       {
            console.log(result);
            res.json({"status":1,"message":"修改成功"});
       });
    
});

router.post('/changePhone', function(req, res, next) {
    var phone = req.body.phone;
    var sess = req.session;
    //sess.userId = null;
    console.log(phone);
    
    var checkCode = req.body.checkCode;
    
    if(phone == null){
        res.json({"status":0,"message":"电话不能为空"});
        return;
    }
    if(checkCode == null){
        res.json({"status":0,"message":"验证码不能为空"});
        return;
    }
    if(parseInt(checkCode) == parseInt(sess.checkCode)){
        var collection = global.db.collection('user');
            
        collection.updateOne({"_id":ObjectID(sess.userId)}, {$set:{"phone":phone}},
              function(err,result)
              {
                  console.log(result);
                  res.json({"status":1,"message":"修改成功"});
              });
    }
    else
    {
        res.json({"status":0,"message":"输入验证码错误"});
    }   
});

router.post('/removeCollection', function(req, res, next){
    var sess = req.session;
    var entity_type = parseInt(req.body.entity_type);
    var entity_id = ObjectID(req.body.entity_id);
    if(sess.userId == null)
    {
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    else
    {
        var userCollection = global.db.collection('userCollection');
        userCollection.findOne({"userId":ObjectID(sess.userId),"entity_type":entity_type,"entity_id":entity_id}, function(err, item){
            if(item == null)
            {
                res.json({"status":0,"message":"此条尚未收藏"});
                return;
            }
            else
            {
                var common_data_collection = global.db.collection('common_data');
                common_data_collection.update({"entity_type":entity_type,"entity_id":entity_id},{"$inc":{"collection_count":-1}},function(err,item){
                            
                    var entity_collection_name = '';
                    if (entity_type == 1)
                    {
                        entity_collection_name = 'hotel';
                    }
                    else if (entity_type == 2)
                    {
                        entity_collection_name = 'restaurant';
                    }
                    else if (entity_type == 3)
                    {
                        entity_collection_name = 'sights';
                    }
                    var entity_collection = global.db.collection(entity_collection_name);
                    entity_collection.update({"_id":ObjectID(entity_id)},{"$inc":{"collection_count":-1}},function(err,item){
                                
                        var collection = global.db.collection('userCollection');
            
                        collection.remove({"userId":ObjectID(sess.userId),"entity_type":entity_type, "entity_id":entity_id},
                            function(err,result)
                            {
                                console.log(result);
                              //res.json({"status":1,"message":"修改成功"});
                                if(!err)
                                {
                                    res.json({"status":1,"message":"删除成功"});
                                }
                                else
                                {
                                    res.json({"status":0,"message":"删除失败"});
                                }
                        });
                            
                    });
                });
            }
        });
    }
});
/*
router.get('/batchRemoveCollection', function(req, res, next){

    var sess = req.session;
    var entities_str = req.body.entities;
    var entities = eval('(' + entities_str + ')');
    
    if(sess.userId == null)
    {
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    else
    {
        var collection = global.db.collection('userCollection');
        
        for (var i = 0; i < entities.length; i++)
        {
            collection.remove({"userId":ObjectID(sess.userId),"entity_type":entities[i].entity_type, "entity_id":entities[i].entity_id},
                function(err,result)
                {
                 });
        }
        res.json({"status":1,"message":"删除成功"});
            
        
    }
});
*/

router.get('/info', function(req, res, next){
    var sess = req.session;
    if(sess.userId == null)
    {
        res.json({"status":0, "message":"请先登录"});
    }
    else
    {
        var collection = global.db.collection('user');
            
        collection.findOne({"userId":ObjectID(sess.userId)}, function(err,item){
            if(err)
            {
                res.json({"status":0,"data":{}});
            }
            else
            {
                res.json({"status":1, "data":item});
            }
        });
    }
});

router.post('/collect', function(req, res, next){
    var sess = req.session;
    var entity_type = parseInt(req.body.entity_type);
    var entity_id = ObjectID(req.body.entity_id);
    
    console.log(sess.userId);
    console.log(entity_type);
    console.log(entity_id);

    
    if(sess.userId == null)
    {
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    else
    {
        var userCollection = global.db.collection('userCollection');
        userCollection.findOne({"userId":ObjectID(sess.userId),"entity_type":entity_type,"entity_id":entity_id}, function(err, item){
            if(item != null)
            {
                res.json({"status":0,"message":"此条已收藏过"});
                return;
            }
            else
            {
                    var collection = global.db.collection('common_data');
            //collection.updateOne({})
                    collection.findOne({"entity_type":entity_type,"entity_id":entity_id},function(err,item){
                        //var userCollection = db.collection('userCollection');
                        if(err)
                        {
                            res.json({"status":0,"message":"此项不存在"});
                            return;
                        }
                        if(item == null)
                        {
                            res.json({"status":0,"message":"此项不存在"});
                            return;
                        }
                     
                        var province = item["province"];
                        var area_id = item["area_id"];
                        var gps = item["gps"];
                        var name = item["name"];
                        var address = item["address"];
                        var cover = item["cover"];
                        var phone = item["phone"];
                      
                        collection.update({"entity_type":entity_type,"entity_id":entity_id},{"$inc":{"collection_count":1}},function(err,item){
                            
                            var entity_collection_name = '';
                            if (entity_type == 1)
                            {
                                entity_collection_name = 'hotel';
                            }
                            else if (entity_type == 2)
                            {
                                entity_collection_name = 'restaurant';
                            }
                            else if (entity_type == 3)
                            {
                                entity_collection_name = 'sights';
                            }
                            var entity_collection = global.db.collection(entity_collection_name);
                            entity_collection.update({"_id":ObjectID(entity_id)},{"$inc":{"collection_count":1}},function(err,item){
                                
                                userCollection.insertOne({"userId":ObjectID(sess.userId),"entity_type":entity_type, "entity_id":entity_id, "insert_date":new Date(),
                                    "province":province,"area_id":area_id,"gps":gps,"name":name,"address":address,"cover":cover,"phone":phone},function(err,result)
                                {
                //console.log(result);
                                    console.log(44);
                                    if(!err)
                                    {
                                        res.json({"status":1,"message":"收藏成功"});
                                    }
                                    else{
                                        res.json({"status":0,"message":"收藏失败"});
                                    }
                                });
                                
                            });
                            
                        });
                        
                    });
            }
                
        });
    }
});

router.get('/getCollection/entity_type/:entity_type/startIndex/:startIndex/length/:length', function(req, res, next){
    var sess = req.session;
    var entity_type = parseInt(req.params.entity_type);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    
    console.log(sess.userId);
    console.log(entity_type);
    console.log(startIndex);
    console.log(length);
    
    var userCollection = global.db.collection('userCollection');
    userCollection.find({"userId":ObjectID(sess.userId), "entity_type":entity_type}).skip(startIndex).limit(length).toArray(function(err, items) {
        console.log(items);
        if(items == null)
        {
            res.json({"status":1,"data":[]});
        }
        else
        {
            res.json({"status":1,"data":items});
        }
    });
    
    
});

router.get('/getCollectionMix/startIndex/:startIndex/length/:length', function(req, res, next){
    var sess = req.session;
    var entity_type = parseInt(req.params.entity_type);
    var startIndex = parseInt(req.params.startIndex);
    var length = parseInt(req.params.length);
    
    if (length > 10)
    {
        res.json({"status":0, "data":[],"message":"长度不能超过10"});
        return;
    }
    
    console.log(sess.userId);
    console.log(entity_type);
    console.log(startIndex);
    console.log(length);
    
    var userCollection = global.db.collection('userCollection');
    userCollection.find({"userId":ObjectID(sess.userId)}).skip(startIndex).limit(length).toArray(function(err, items) {
        console.log(items);
        if(items == null)
        {
            res.json({"status":1,"data":[]});
        }
        else
        {
            res.json({"status":1,"data":items})
        }
    });
    
    
});

router.get('/getAllCollectionItems', function(req, res, next){ 
    var sess = req.session;
    
    if(sess.userId == null)
    {
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    console.log("start");
    console.log(sess.userId);
    var userCollection = global.db.collection('userCollection');
    userCollection.find({"userId":ObjectID(sess.userId)},{"entity_type":1,"entity_id":1}).toArray(function(err, items) {
        if(items == null)
        {
            console.log("1");
            res.json({"status":1,"data":[]});
        }
        else
        {
            console.log("2");
            res.json({"status":1,"data":items});
        }
    });
});

router.post("/uploadHeaderImage",function (req,res,next) {
    var Range = 1000000 - 100000;   
    var Rand = Math.random();   
    var checkCode = 100000 + Math.round(Rand * Range);
    var form = new multiparty.Form();
    console.log(form);
    //console.log(req.body.Filedata);
    
    var sess = req.session;
    
    if(sess.userId == null)
    {
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    
   
    form.parse(req, function(err, fields, files) {
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        console.log("start");
        console.log(files);
        console.log("end");
     
        //fs.rename(files.upload[0].path, "/Users/wanglei/Desktop/" + files.upload[0].originalFilename, function(err) {
        try{
            //var fileName = sess.userId + files.upload[0].originalFilename
            var filenames = files.upload[0].originalFilename.split(".");
            var md5 = cry.createHash('md5');
            md5.update(files.upload[0].originalFilename);
            var d = md5.digest('hex');
            var fileName = sess.userId + Date.now() +  checkCode + d + "." + filenames[filenames.length - 1];
            var serverPath = "/opt/headerImage/" + fileName
            fs.rename(files.upload[0].path, serverPath, function(err) {
                console.log(files.upload[0].path);
                console.log(files.upload[0].originalFilename);
            //console.log( "/Users/wanglei/Desktop/" + files.upload[0].originalFilename);
                if(!err){
                    var collection = global.db.collection('user');
                    collection.updateOne(
                        {"_id":ObjectID(sess.userId)},
                        {$set:{"headerImage":"http://www.xiangyouji.com.cn:3000/" + fileName}},
                        function(err, results){
                            if(!err)
                            {
                                res.json({"status":1,"message":"上传成功","url":"http://www.xiangyouji.com.cn:3000/" + fileName});
                                return;
                            }
                            res.json({"status":0,"message":"上传失败"});
                            
                        });
                    
                }
                else
                {
                    res.json({"status":0,"message":"上传失败"});
                }
       
            });
        }
        catch(e)
        {
            res.json({"status":0,"message":e.message});
        }
        
    });
    
    //res.json({"status":1,"message":"上传成功"});
});

router.post("/getCheckCode", function(req, res, next){
    console.log("getCheckCode");
    var phone = req.body.phone;
    if(phone == null)
    {
        res.json({"status":0,"message":"电话不能为空"});
        return;    
    }
    
    var Range = 1000000 - 100000;   
    var Rand = Math.random();   
    var checkCode = 100000 + Math.round(Rand * Range);   
    
    var postData = querystring.stringify({
        'sn': 'SDK-LJP-010-00110', 
        'pwd': '51FC662DD2521E748D699B8D160BCCD5', 
        'mobile': phone,
        'content': '您的验证码:' + checkCode + '【乡游记】',//"你好【乡游记】",
        'ext':'', 
        'stime':'', 
        'rrid':'', 
        'msgfmt':'15'
    });

    var options = {
        hostname: 'sdk.entinfo.cn',
        port: 8061,
        path: '/webservice.asmx/mdsmssend',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    var request = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

// write data to request body
    request.write(postData);
    
    var sess = req.session;
    sess.checkCode = checkCode;
    
    res.json({"status":1, "message":"发送成功","data":{"effectTime":60}});
});

router.post("/commentSights", function(req, res, next){
    //var 
    
    var sess = req.session;
    if(sess.userId == null)
    {
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    console.log("1");
    
    //先要用userId取昵称，头像信息
    var imageString = req.body.images;
    var arrayImages = [];
    if (imageString != "")
    {
        arrayImages = imageString.split("_");
    }
    

    console.log("arrayImage:");
    console.log(arrayImages);

    var id = ObjectID(req.body.id);
    var general_score = parseInt(req.body.general_score);
    
    var comment_text = req.body.comment_text;
    
    var price_per_person = parseInt(req.body.price_per_person);
    console.log("3");
    var userCollection = global.db.collection('user');
    userCollection.findOne({"_id":ObjectID(sess.userId)},function(err, item) {
        console.log("4");
        if (item == null)
        {
            res.json({"status":0, "message":"查找失败"});
            return;
        }
        console.log("5");
        var nickname = item["nickname"];
        var headerImage = item["headerImage"];
        console.log("6");
        var sights_comment = global.db.collection('sights_comment');
        var common_data_collection = global.db.collection('common_data');
        console.log("7");
        
        sights_comment.insertOne({"userId":ObjectID(sess.userId),"sights_id":id, "general_score":general_score, "comment_text":comment_text,"images":arrayImages,"insert_date":new Date(),"price_per_person":price_per_person,"nickname":nickname,"headerImage":headerImage},function(err,result){
            var sightsCollection = global.db.collection('sights');
            console.log("8");
            if (price_per_person == 0)
            {
                sightsCollection.updateOne({"_id":ObjectID(id)},{"$inc":{"comment_count":1}},function(err,item){
                    //you should add json for return;
                    common_data_collection.updateOne({"entity_id":ObjectID(id),"entity_type":3},{"$inc":{"comment_count":1}},function(err,item){
                        res.json({"status":1, "message":"评论成功"});
                        console.log("9");
                        return;
                    });
                });
            }
            else
            {
                console.log("10");
                sightsCollection.findOne({"_id":ObjectID(id)},function(err,item){
                    if (item == null){
                        res.json({"status":0, "message":"查找失败"});
                        return;
                    }
                    var comment_count = item["comment_count"];//you must add another count to store it which will be not shown to the client side
                    var avg_price_count = item["avg_price_count"];
                    
                    var avg_price = item["avg_price"];
                    avg_price = (avg_price*avg_price_count + price_per_person)/(avg_price_count + 1);
                    
                    var star_count = item["star_count"];
                    star_count = (star_count*comment_count + general_score)/(comment_count + 1);
            
                    
                    
                    comment_count++;
                    avg_price_count++;
                    
                    console.log("11");
                    sightsCollection.updateOne({"_id":ObjectID(id)},{"$set":{"comment_count":comment_count,"avg_price":avg_price,"avg_price_count":avg_price_count,"star_count":star_count}},function(err,item){
                    //you should add json for return;
                        if (item == null)
                        {
                            res.json({"status":0, "message":"更新失败"});
                            return;
                        }
                        common_data_collection.updateOne({"entity_id":ObjectID(id),"entity_type":3},{"$set":{"comment_count":comment_count}},function(err,item){
                            res.json({"status":1, "message":"评论成功"});
                            console.log("9");
                            return;
                        });
                    });
                    
                });
            }
            
            /*
            restaurantCollection.updateOne({"_id":ObjectID(id)},{"$inc":{"comment_count":1}},function(err,item){
                
                
            });
            */
        
        
        });
            
    });
    
    
    
    
    
    
                            
    //db.restaurant_comment.
    
    
});

router.post("/commentHotel", function(req, res, next){
    //var 
    
    var sess = req.session;
    if(sess.userId == null)
    {
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    console.log("1");
    
    //先要用userId取昵称，头像信息
    var imageString = req.body.images;
    var arrayImages = [];
    if (imageString != "")
    {
        arrayImages = imageString.split("_");
    }

    var id = ObjectID(req.body.id);
    var general_score = parseInt(req.body.general_score);
    var location_score = parseInt(req.body.location_score);
    
    var room_score = parseInt(req.body.room_score);
    var service_score = parseInt(req.body.service_score);
    
    var comment_text = req.body.comment_text;
    
    var price_per_person = parseInt(req.body.price_per_person);
    console.log("3");
    var userCollection = global.db.collection('user');
    userCollection.findOne({"_id":ObjectID(sess.userId)},function(err, item) {
        console.log("4");
        if (item == null)
        {
            res.json({"status":0, "message":"查找失败"});
            return;
        }
        console.log("5");
        var nickname = item["nickname"];
        var headerImage = item["headerImage"];
        console.log("6");
        var hotel_comment = global.db.collection('hotel_comment');
        var common_data_collection = global.db.collection('common_data');
        console.log("7");
        
        hotel_comment.insertOne({"userId":ObjectID(sess.userId),"hotel_id":id, "general_score":general_score, "location_score":location_score, "room_score":room_score, "service_score": service_score, "comment_text":comment_text,"images":arrayImages,"insert_date":new Date(),"price_per_person":price_per_person,"nickname":nickname,"headerImage":headerImage},function(err,result){
            var hotelCollection = global.db.collection('hotel');
            console.log("8");
            if (price_per_person == 0)
            {
                hotelCollection.updateOne({"_id":ObjectID(id)},{"$inc":{"comment_count":1}},function(err,item){
                    //you should add json for return;
                    common_data_collection.updateOne({"entity_id":ObjectID(id),"entity_type":1},{"$inc":{"comment_count":1}},function(err,item){
                        res.json({"status":1, "message":"评论成功"});
                        console.log("9");
                        return;
                    });
                });
            }
            else
            {
                console.log("10");
                hotelCollection.findOne({"_id":ObjectID(id)},function(err,item){
                    if (item == null){
                        res.json({"status":0, "message":"查找失败"});
                        return;
                    }
                    var comment_count = item["comment_count"];//you must add another count to store it which will be not shown to the client side
                    var avg_price_count = item["avg_price_count"];
                    
                    var avg_price = item["avg_price"];
                    avg_price = (avg_price*avg_price_count + price_per_person)/(avg_price_count + 1);
                    
                    var star_count = item["star_count"];
                    star_count = (star_count*comment_count + general_score)/(comment_count + 1);
                    var location_value = item["location_value"];
                    location_value = (location_value*comment_count + location_score)/(comment_count + 1);
                    var service_value = item["service_value"];
                    service_value = (service_value*comment_count + service_score)/(comment_count + 1);
                    var room_value = item["room_value"];
                    room_value = (room_value*comment_count + room_score)/(comment_count + 1);
                    
                    
                    comment_count++;
                    avg_price_count++;
                    
                    console.log("11");
                    hotelCollection.updateOne({"_id":ObjectID(id)},{"$set":{"comment_count":comment_count,"avg_price":avg_price,"avg_price_count":avg_price_count,"star_count":star_count,"location_value":location_value,"service_value":service_value,"room_value":room_value}},function(err,item){
                    //you should add json for return;
                        if (item == null)
                        {
                            res.json({"status":0, "message":"更新失败"});
                            return;
                        }
                        common_data_collection.updateOne({"entity_id":ObjectID(id),"entity_type":1},{"$set":{"comment_count":comment_count}},function(err,item){
                            res.json({"status":1, "message":"评论成功"});
                            console.log("9");
                            return;
                        });
                       
                    });
                    
                });
            }
            
            /*
            restaurantCollection.updateOne({"_id":ObjectID(id)},{"$inc":{"comment_count":1}},function(err,item){
                
                
            });
            */
        
        
        });
            
    });
    
    
    
    
    
    
                            
    //db.restaurant_comment.
    
    
});

router.post("/commentRestaurant", function(req, res, next){
    //var 
    
    var sess = req.session;
    if(sess.userId == null)
    {
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    console.log("1");
    
    //先要用userId取昵称，头像信息
    var imageString = req.body.images;
    var arrayImages = [];
    if (imageString != "")
    {
        arrayImages = imageString.split("_");
    }
    /*
    if (imageString.indexOf("_") >= 0)
    {
        arrayImages = req.body.images.split("_");
    }
    */
    
    console.log(arrayImages);
    var id = ObjectID(req.body.id);
    var general_score = parseInt(req.body.general_score);
    var taste_score = parseInt(req.body.taste_score);
    
    var environment_score = parseInt(req.body.environment_score);
    var service_score = parseInt(req.body.service_score);
    
    var comment_text = req.body.comment_text;
    
    var price_per_person = parseInt(req.body.price_per_person);
    
    console.log(req.body);
    console.log("3");
    var userCollection = global.db.collection('user');
    userCollection.findOne({"_id":ObjectID(sess.userId)},function(err, item) {
        console.log("4");
        if (item == null)
        {
            res.json({"status":0, "message":"查找失败"});
            return;
        }
        console.log("5");
        var nickname = item["nickname"];
        var headerImage = item["headerImage"];
        console.log("6");
        var restaurant_comment = global.db.collection('restaurant_comment');
        var common_data_collection = global.db.collection('common_data');
        console.log("7");
        
        restaurant_comment.insertOne({"userId":ObjectID(sess.userId),"restaurant_id":id, "general_score":general_score, "taste_score":taste_score, "environment_score":environment_score, "service_score": service_score, "comment_text":comment_text,"images":arrayImages,"insert_date":new Date(),"price_per_person":price_per_person,"nickname":nickname,"headerImage":headerImage},function(err,result){
            var restaurantCollection = global.db.collection('restaurant');
            console.log("8");
            if (price_per_person == 0)
            {
                restaurantCollection.updateOne({"_id":ObjectID(id)},{"$inc":{"comment_count":1}},function(err,item){
                    //you should add json for return;
                   
                    common_data_collection.updateOne({"entity_id":ObjectID(id),"entity_type":2},{"$inc":{"comment_count":1}},function(err,item){
                        res.json({"status":1, "message":"评论成功"});
                        console.log("9");
                        return;
                    });
                    
                });
            }
            else
            {
                console.log("10");
                restaurantCollection.findOne({"_id":ObjectID(id)},function(err,item){
                    if (item == null){
                        res.json({"status":0, "message":"查找失败"});
                        return;
                    }
                    var comment_count = item["comment_count"];//you must add another count to store it which will be not shown to the client side
                    var avg_price_count = item["avg_price_count"];
                    
                    var avg_price = item["avg_price"];
                    avg_price = (avg_price*avg_price_count + price_per_person)/(avg_price_count + 1);
                    
                    var star_count = item["star_count"];
                    star_count = (star_count*comment_count + general_score)/(comment_count + 1);
                    var taste_value = item["taste_value"];
                    taste_value = (taste_value*comment_count + taste_score)/(comment_count + 1);
                    var service_value = item["service_value"];
                    service_value = (service_value*comment_count + service_score)/(comment_count + 1);
                    var environment_value = item["environment_value"];
                    environment_value = (environment_value*comment_count + environment_score)/(comment_count + 1);
                    
                    comment_count++;
                    avg_price_count++;
                    
                    console.log("11");
                    restaurantCollection.updateOne({"_id":ObjectID(id)},{"$set":{"comment_count":comment_count,"avg_price":avg_price,"avg_price_count":avg_price_count,"star_count":star_count,"taste_value":taste_value,"service_value":service_value,"environment_value":environment_value}},function(err,item){
                    //you should add json for return;
                        if (item == null)
                        {
                            res.json({"status":0, "message":"更新失败"});
                            return;
                        }
                        common_data_collection.updateOne({"entity_id":ObjectID(id),"entity_type":2},{"$set":{"comment_count":comment_count}},function(err,item){
                            res.json({"status":1, "message":"评论成功"});
                            console.log("9");
                            return;
                        });
                    });
                    
                });
            }
            
            /*
            restaurantCollection.updateOne({"_id":ObjectID(id)},{"$inc":{"comment_count":1}},function(err,item){
                
                
            });
            */
        
        
        });
            
    });
    
    
    
    
    
    
                            
    //db.restaurant_comment.
    
    
});

router.post("/uploadCommentImage",function (req,res,next) {
    
    var Range = 1000000 - 100000;   
    var Rand = Math.random();   
    var checkCode = 100000 + Math.round(Rand * Range);  
    
    var form = new multiparty.Form();
    console.log(form);
    //console.log(req.body.Filedata);
    
    var sess = req.session;
    
    if(sess.userId == null)
    {
        console.log("请先登录");
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    
   
    form.parse(req, function(err, fields, files) {
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        console.log("start");
        console.log(files);
        console.log("end");
     
        //fs.rename(files.upload[0].path, "/Users/wanglei/Desktop/" + files.upload[0].originalFilename, function(err) {
        try{
            //var fileName = sess.userId + Date.now() +  checkCode + files.upload[0].originalFilename
            var filenames = files.upload[0].originalFilename.split(".");
            var md5 = cry.createHash('md5');
            md5.update(files.upload[0].originalFilename);
            var d = md5.digest('hex');
            var fileName = sess.userId + Date.now() +  checkCode + d + "." + filenames[filenames.length - 1];
            var serverPath = "/opt/commentImage/" + fileName;
            console.log(fileName);
            
            fs.rename(files.upload[0].path, serverPath, function(err) {
                console.log(files.upload[0].path);
                console.log(files.upload[0].originalFilename);
            //console.log( "/Users/wanglei/Desktop/" + files.upload[0].originalFilename);
                if(!err){
                    console.log("success");
                    res.json({"status":1,"message":"上传成功","data":{"url":"http://www.xiangyouji.com.cn:3000/" + fileName}});
                    return;
                    
                }
                else
                {
                    console.log("faild");
                    res.json({"status":0,"message":"上传失败"});
                }
       
            });
        }
        catch(e)
        {
            console.log("err:" + e.message);
            res.json({"status":0,"message":e.message});
        }
        
    });
    
    //res.json({"status":1,"message":"上传成功"});
});

router.post("/alipay",function (req,res,next) {
    console.log("alipay");//trade_no
    console.log(req.body);
    res.send("success");
    
});


router.post("/alipayClientSidePrePay",function(req,res,next){
    var sess = req.session;
    console.log(1);
    if(sess.userId == null)
    {
        console.log("请先登录");
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    var orderNo = req.body.orderNo;
    var mny = parseFloat(req.body.mny);
    var productName = req.body.productName;
    console.log(2);
    
    var pre_pay_order = global.db.collection('alipay_pre_pay_order');
    pre_pay_order.insertOne({"userId":ObjectID(sess.userId),"orderNo":orderNo,"mny":mny,"productName":productName,"trade_date":new Date()},function(err,result){
        res.json({"status":1, "message":"交易成功"});
    });
    
});

router.post("/alipayClientSideAfterPay",function(req,res,next){
    var sess = req.session;
    
    if(sess.userId == null)
    {
        console.log("请先登录");
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    var orderNo = req.body.orderNo;
    var mny = parseFloat(req.body.mny);
    var productName = req.body.productName;
    
    var entity_id = req.body.entity_id;
    var entity_type = parseInt(req.body.entity_type);
    
    var amt = parseInt(req.body.amt);
    
    var after_pay_order = global.db.collection('alipay_after_pay_order');
    after_pay_order.insertOne({"userId":ObjectID(sess.userId),"orderNo":orderNo,"mny":mny,"productName":productName,"trade_date":new Date(),"entity_id":ObjectID(entity_id),"entity_type":entity_type,"amt":amt},function(err,result){
        res.json({"status":1, "message":"交易成功"});
    });
    
    //var order = global.db.collection('alipay_after_pay_order');
    
});

router.get("/routeOrderList",function(req,res,next){
    var sess = req.session;
    
    if(sess.userId == null)
    {
        console.log("请先登录");
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    
    
    var after_pay_order = global.db.collection('alipay_after_pay_order');
    after_pay_order.find({"userId":ObjectID(sess.userId),"entity_type":4},{"orderNo": 1,"productName":1,"_id":1,"entity_id":1}).toArray(function(err, items) {
        /*
        if (err)
        {
            console.log(3);
            res.json({"status":1,"data":[]});
            return;
        }
        */
        if (items == null){
           
            res.json({"status":1,"data":[]});
            return; 
        }
       
        res.json({"status":1,"data":items}); 
       
    });
    
});
router.get("/routeOrderDetail/order_id/:order_id",function(req,res,next){
    console.log("detail");
    var sess = req.session;
    
    if(sess.userId == null)
    {
        console.log("请先登录");
        res.json({"status":0, "message":"请先登录"});
        return;
    }
    
    var order_id = ObjectID(req.params.order_id);
    console.log(order_id)
    //console.log(req);
    
    var after_pay_order = global.db.collection('alipay_after_pay_order');
    
    after_pay_order.findOne({"_id":ObjectID(order_id)},function(err, item) {
        if(item == null)
        {
            console.log(1);
            res.json({"status":1,"data":{}});
            return;
        }
        console.log(2);
        console.log(item);
        res.json({"status":1,"data":item});
        
    });
    
    
});

/*

router.post("/clientSidePay",function(req,res,next)
{
    
});
*/
module.exports = router;
