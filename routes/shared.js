var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();


/* GET home page. */
router.get('/entity_type/:entity_type/entity_id/:entity_id', function(req, res, next) {
  var entity_type = parseInt(req.params.entity_type);
  var entity_id = req.params.entity_id;
  /*var entity_type = parseInt(req.body.entity_type);
    var entity_id = ObjectID(req.body.entity_id);*/
  //var entity_id = "562939d7b80f0b0ed1d2bddc";
  var collectionName = ""
  
  if (entity_type == 1)
  {
    collectionName = "hotel";
  }
  else if (entity_type == 2)
  {
    collectionName = "restaurant";
  }
  else if (entity_type == 3)
  {
    collectionName = "sights";
  }
  else if (entity_type == 4)
  {
     collectionName = "tour_route";
  }
  
  var entity_collection = global.db.collection(collectionName);
  entity_collection.findOne({"_id":ObjectID(entity_id)},function(err, item){
    
    if (item == null)
    {
      res.render('shared', { image_url: "" });
      return;
    }
    res.render('shared', { image_url: item['cover'] });
    
  });
  
  
  //res.render('shared', { image_url: 'http://www.xiangyouji.com.cn:3000/227269f7-f4d2-3427-b70c-7d057e58589c.jpg' });
  
});

module.exports = router;
