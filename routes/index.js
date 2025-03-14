const express = require('express');
const passport = require('passport');
const router = express.Router();
const userModel = require("../models/user");
const postModel = require("../models/posts");
const upload = require("../utils/fileUploader");
const path = require('path');
const fs = require('fs').promises;

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {error: req.flash('error')});
});


router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', upload.single('image'), async function(req, res, next) {
  const {username, email, password} = req.body;
  const user = new userModel({username, email, image: req.file.filename});
  await user.save();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
    const user = await userModel.findOne({
        username:req.session.passport.user
    })
    .populate('posts');
    res.render('profile', {user});
});

router.get('/show/posts', isLoggedIn, async function(req, res, next) {
    const user = await userModel.findOne({
        username:req.session.passport.user
    })
    .populate('posts');
    res.render('show', {user});
});
router.get('/feed', isLoggedIn, async function(req, res, next) {
    const user = await userModel.findOne({
        username:req.session.passport.user
    })
    const posts = await postModel.find();
    res.render('feed', {posts, user});
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next();
    res.redirect("/");
  }
  

module.exports = router;