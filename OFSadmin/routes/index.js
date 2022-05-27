var express = require('express');
var app = express.Router();
var monk=require('monk');
var db =monk('localhost:27017/vidzy');
var collection=db.get('videos');
var passport = require('passport');
var Account = require('../models/account');

const { ensureAuthenticated } = require('../config/auth');
app.get('/', function (req, res) {
      res.render('landing');
  });
//app.get('/home', ensureAuthenticated, (req, res) => 
  //res.render('home', {
    //user: req.user
 //})
//);
app.get('/home', ensureAuthenticated, function(req, res) {
     req.session.user=req.user;
     req.session.save();
     res.render('home',{ user: req.user });
  
}
);
module.exports = app;
