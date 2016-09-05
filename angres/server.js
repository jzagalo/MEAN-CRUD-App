// Dependencies
var express = require('express');
var mongojs = require('mongojs');
var app = express();

var bodyParser = require('body-parser');
var db = mongojs('test',['posts']);

app.use(bodyParser.urlencoded({ 'extended':'true'}));
app.use(bodyParser.json());

app.use(express.static(__dirname +"/public"));


app.get("/posts", function(req, res){	
	db.posts.find(function(err, docs){
		res.json(docs);
	});
});


app.post("/posts", function(req, res){	
	db.posts.insert(req.body, function(err, docs){
		

	});
});

app.put('/posts/:id', function(req, res){
	var id = req.params.id;	

	db.posts.findAndModify(

	{ query: {_id: mongojs.ObjectId(id)},
      update :{$set: {title: req.body.title, 
    	       author: req.body.author,
          date:req.body.date,
          message: req.body.message}},
          new : true}, function(err, docs){
          	  	

          })

});
app.get("/posts/:id", function(req, res){	
	
	var id = req.params.id;
	console.log(id);
	db.posts.findOne({ _id: mongojs.ObjectId(id)}, function(err, docs){
		//console.log(docs);
		res.json(docs);
	});
});
app.delete('/posts/:id', function(req, res){
	var id = req.params.id;
	db.posts.remove({_id: mongojs.ObjectId(id)}, function(err, docs){
		console.log(docs);
	}); 

});



//Start Server
app.listen(3000);
console.log('API is running');

