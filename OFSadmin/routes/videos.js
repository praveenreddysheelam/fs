var express = require('express');
var router = express.Router();
var monk=require('monk');
var db =monk('localhost:27017/vidzy');
var collection=db.get('videos');
//api/videos
router.get('/', function(req, res) {
	collection.find({},function(err,videos){
     if (err) throw err;
     res.json(videos);
	});
  //res.render('index', { title: 'Express' });
});
router.get('/:id', function(req, res) {
    collection.find({_id:req.params.id},function(err,video){
     if (err) throw err;
     res.json(video);
    });
  //res.render('index', { title: 'Express' });
});
router.post('/', function(req, res) {
    collection.insert(
    {
        title:req.body.title,
     genre:req.body.genre,
     description:req.body.desc,
    },
    function(err,video){
     if (err) throw err;
     res.json(video);
    });
  //res.render('index', { title: 'Express' });
});
router.put('/:id', function(req, res) {
    collection.update({_id:req.params.id},
    {
     $set : {
     title:req.body.title,
     genre:req.body.genre,
     description:req.body.desc,
    }

    },
    function(err,video){
     if (err) throw err;
     res.json(video);
    });
  //res.render('index', { title: 'Express' });
});
router.delete('/:id', function(req, res) {
    collection.remove({_id:req.params.id},function(err,video){
     if (err) throw err;
     res.json(video);
    });
  //res.render('index', { title: 'Express' });
});


module.exports = router;