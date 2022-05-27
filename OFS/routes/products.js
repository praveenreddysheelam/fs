var express = require('express');
var app = express.Router();
var monk=require('monk');
var db =monk('localhost:27017/OFS');
var collection=db.get('products');
const { ensureAuthenticated } = require('../config/auth');
app.get('/cart',ensureAuthenticated,function(req,res){
	var collection=db.get('cart');
	collection.find({uid:req.session.user.email},function(err,products){
     if (err) throw err;
     //console.log(vi)
     console.log(req.session.user);
     res.render('cart',{results:products,
     	user:req.session.user});
  });
});
app.get('/orders',ensureAuthenticated,function(req,res){
	var collection=db.get('orders');
	collection.find({uid:req.session.user.email},function(err,products){
     if (err) throw err;
     //console.log(vi)
     console.log(req.session.user);
     res.render('orders',{results:products,
     	user:req.session.user});
  });
});
app.get('/checkout',ensureAuthenticated,function(req,res){
	var collection=db.get('cart');
	var collection1=db.get('orders');
	collection.find({uid:req.session.user.email},function(err,products){
     if (err) throw err;
     for(let i=0;i<products.length;i++)
     {
     	collection1.insert({
         uid:req.session.user.email,
         pid:req.params.id,
         title:products[i].title,
         category: products[i].category,
         image:products[i].image,
         cost: products[i].cost,
         quantity:products[i].quantity

      },
    function(err,video){
     if (err) throw err;
     console.log("added");
     res.send('checked out successfully');
     //res.json(video);
    });
     }
  });
});
app.get('/search',ensureAuthenticated,function(req,res){
	var collection=db.get('products');
	if(req.query.search){
    console.log(req.query.filter);
    var text=req.query.search;
    var text1=req.query.filter;
    console.log(req.query.filter);
    var src=text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    var ftr=text1.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(src, 'gi');
    const regex1 = new RegExp(ftr, 'gi');
    collection.find({$and:[
        {title:regex},
        {description:regex1}
    ]},function(err,products){
     if (err) throw err;
     res.render('search',{ results: products });
  });
    }
    else if(req.query.filter)
    {
    var collection=db.get('products');
    var text1=req.query.filter;
    console.log(text1);
    var ftr=text1.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
     const regex1 = new RegExp(ftr, 'gi');
     collection.find({description:regex1},function(err,products){
     if (err) throw err;
     res.render('search',{ results: products });
  });
    }
    else{
    	res.send("sent");
    }
});
app.get('/wishlist',ensureAuthenticated,function(req,res){
	var collection=db.get('wishlist');
	collection.find({uid:req.session.user.email},function(err,products){
     if (err) throw err;
     //console.log(vi)
     console.log(req.session.user);
     res.render('wishlist',{results:products,
     	user:req.session.user});
  });
});
app.get('/wishlist',ensureAuthenticated,function(req,res){
	var collection=db.get('wishlist');
	collection.find({uid:req.session.user.email},function(err,products){
     if (err) throw err;
     //console.log(vi)
     console.log(req.session.user);
     res.render('wishlist',{results:products,
     	user:req.session.user});
  });
});
app.get('/cart/update/:id',ensureAuthenticated,function(req,res){
	var collection=db.get('cart');
	collection.findOne({_id:req.params.id},function(err,product){
     if (err) throw err;
     collection.update({_id:req.params.id},
    {
     $set : {
     quantity:product.quantity-1
     
    }

    },
    function(err,result){
     if (err) throw err;
     if(product.quantity==0){
       res.redirect('/products/cart/delete/'+req.params.id);
     }
     else{
     res.redirect('/products/cart');
      }
     //res.json(video);
    });
    });
	
});
app.get('/wishlist/delete/:id',ensureAuthenticated,function(req,res){
	var collection=db.get('wishlist');
	collection.remove({_id:req.params.id},function(err,product){
     if (err) throw err;
     res.redirect('/products/wishlist');
    });
	
});
app.get('/cart/delete/:id',ensureAuthenticated,function(req,res){
	var collection=db.get('cart');
	collection.remove({_id:req.params.id},function(err,product){
     if (err) throw err;
     res.redirect('/products/cart');
    });
	
});
app.get('',ensureAuthenticated,  function(req, res) {
	var page=Number(req.query.page);
	if(!req.query.page){
		page=1;
	}
	var start=(page-1)*5;
	var end=(page)*5;
    var collection=db.get('products');
    collection.find({},function(err,products){
     if (err) throw err;
     //console.log(vi)
     console.log(req.session.user);
     console.log(page);
     var n=products.length;
     var np=Math.ceil(n/5);
     var result=products.slice(start,end);
     console.log(result);
     var iterator= (page - 5) < 1 ? 1: page - 5;
     var endingLink = (iterator+9) <= np ? (iterator+9): np;
     if(endingLink < (page + 4)){
     	iterator -= (page+4) -np;
     }
     res.render('products',{results:result,
     	user:req.session.user,page,iterator,endingLink,np});
  });
}
);
app.get('/:id',ensureAuthenticated,function(req,res){
	var collection=db.get('products');
  collection.findOne({_id:req.params.id},function(err,product){
     if (err) throw err;
     res.render('show',{product: product});
    });
});
app.get('/wishlist/:id',ensureAuthenticated,function(req,res){
     collection=db.get('products');
    collection.findOne({_id:req.params.id},function(err,product){
     if (err) throw err;
     collection1=db.get('wishlist');
     collection1.findOne({$and:[
        {uid:req.session.user.email},
        {pid:req.params.id}
    ]},function(err,result){
     if (err) throw err;
     if(!result)
     {
        collection1.insert({
         uid:req.session.user.email,
         pid:req.params.id,
         title:product.title,
         category: product.category,
         image:product.image,
         cost: product.cost,
         desc:product.description
      },
    function(err,video){
     if (err) throw err;
     console.log("added");
     res.redirect('/products');
     //res.json(video);
    });
     }
     else
     {
       res.redirect('/products');    
     }
     
  });

    });
});
app.get('/cart/:id',ensureAuthenticated,function(req,res){
     collection=db.get('products');
    collection.findOne({_id:req.params.id},function(err,product){
     if (err) throw err;
     collection1=db.get('cart');
     collection1.findOne({$and:[
        {uid:req.session.user.email},
        {pid:req.params.id}
    ]},function(err,result){
     if (err) throw err;
     if(!result)
     {
        collection1.insert({
         uid:req.session.user.email,
         pid:req.params.id,
         title:product.title,
         category: product.category,
         image:product.image,
         cost: product.cost,
         desc:product.description,
         quantity:1
      },
    function(err,video){
     if (err) throw err;
     res.redirect('/products');
     //res.json(video);
    });
     }
     else
     {
          var x = result.quantity+1;
          collection1.update({_id:result._id},
    {
     $set : {
       quantity:x
    }

    },
    function(err,video){
     if (err) throw err;
     res.redirect('/products');
     //res.json(video);
    });
     }
     
  });

    });
});
module.exports= app;
