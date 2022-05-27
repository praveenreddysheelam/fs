var express = require('express');
var app = express.Router();
const path=require('path');
var monk=require('monk');
var db =monk('localhost:27017/OFS');
const multer = require('multer');
var collection=db.get('products');
const { ensureAuthenticated } = require('../config/auth');
const storage= multer.diskStorage({
	destination: (req,file,cb) =>{
		cb(null,'../OFS/public/images');
		cb(null,'../OFSadmin/public/images');
	},
	filename: (req,file,cb) =>{
		console.log(file);
		cb(null,file.originalname)
	}
});
const upload =multer({storage: storage});

app.get('/new',function(req,res){
      res.render('new');
});
app.get('/edit/:id',function(req,res){
    collection.findOne({_id:req.params.id},function(err,product){
     if (err) throw err;
     //res.send(product);
     res.render('edit',{product:product});
    });
});
app.get('/delete/:id',function(req,res){
    collection.remove({_id:req.params.id},function(err,product){
     if (err) throw err;
     res.json(product);
    });
});
app.put('/:id',upload.single('file'), function(req, res) {
    var id=req.params.id
    collection.update({_id:req.params.id},
    {
     $set : {
        title:req.body.title,
		category:req.body.category,
		image:req.file.originalname,
		rating:req.body.rating,
		cost:req.body.cost,
		description:req.body.description
    }

    },
    function(err,video){
     if (err) throw err;
     res.send('updated');
     //res.json(video);
    });
  //res.render('index', { title: 'Express' });
});
app.post('/',upload.single('file'),function(req,res){
	
	collection.insert({
		title:req.body.title,
		category:req.body.category,
		image:req.file.originalname,
		rating:req.body.rating,
		cost:req.body.cost,
		description:req.body.description

	},
    function(err,product){
     if (err) throw err;
     res.send('product');
    });
})
module.exports = app;