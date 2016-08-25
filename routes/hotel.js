



var express = require('express');
var router = express.Router();


var mysql      = require('mysql');




function getMySQLConnection(){
  return mysql.createConnection({
  	host     : '120.25.207.34',
  	user     : 'tour',
  	password : 'Tour@2015',
  	database : 'xyj_common_dev',
	});
}

router.get('/',function(req,res,next){
  res.render("success");
});
router.get('/area_id/:area_id/startIndex/:startIndex/length/:length', function(req, res, next) {
  
  var connection = getMySQLConnection();
  
  connection.connect();

		//connection.query('select * from hotel where area_id = ' + req.params.area_id,function(err, rows, fields) {
    connection.query('select * from hotel where area_id = ' + req.params.area_id + ' limit ' + req.params.startIndex + ',' + req.params.length,function(err, rows, fields) {
			//var result = '{"status":1,"data":{';
      
      
      var status = 0;
      
      
      
      
      console.log('after');
      var dic = {}
      
      var codeArray =  new Array();
      
      if (!err)
      {
        status = 1;
        for(var i=0 ; i < rows.length ; i++)
			  {
				
          codeArray[i] = {"code":rows[i].id.toLocaleString(),"hotel_name":rows[i].hotel_name}
          dic[rows[i].id.toLocaleString()] = rows[i].name;//encodeUTF8(rows[i].name)
		
			  }
        
        
      }
      
      var resultDic = {"status":status,"data":codeArray};
      res.json(resultDic);
	
	
		});
		connection.end();
    
  //res.render('index', { title: 'Express' });
});

module.exports = router;

