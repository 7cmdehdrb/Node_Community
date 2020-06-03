var express = require('express');
var router = express.Router();

var dotenv = require('dotenv');
dotenv.config();

var crypto = require('crypto');

const User = require('./../models/users');

router.get('/login', (req, res, next) => {
  
  let session = req.session;

  if(session.user){
    res.redirect('/');
  }else{
    res.render('users/login', { session: session });
  }

});

router.get('/logout', (req, res, next) => {

  let session = req.session;

  if(!session.user){
    res.redirect('/');
  }else{
    session.user = null;
    req.session.save(function(){
      res.redirect('/');
    });
  }

});

// 로그인 처리

router.post('/login', (req, res, next) => {
  
  let hashPassword = crypto.createHash("sha512").update(req.body.password + process.env.HASH).digest("hex");

  var querySet = User.findOne({
    id: req.body.id,
    password: hashPassword,
  });

  querySet.exec((err, data) => {

    if(err) return;

    if(data){
      req.session.user = {
        id: data.id,
        name: data.name,
      }
      req.session.save(function(){
        res.redirect('/');
      });
    } else{
      res.send(
        '<script>' +
        'alert("해당 유저는 존재하지 않습니다!");' +
        'location.href = "/users/login";' +
        '</script>'
      );
    }

  });


});

router.get('/signup', (req, res, next) => {

  let session = req.session;

  res.render('users/signup', { session: session });

});

// 회원가입 처리

router.post('/signup', (req, res, next) => {

  var querySet = User.findOne({
    id: req.body.id
  });

  querySet.exec((err, data) => {

    if(err) return;

    if(data){
      res.send(
        '<script>' +
        'alert("이미 가입한 유저입니다!");' +
        'location.href = "/users/signup";' +
        '</script>'
      );
    } else{

      let hashPassword = crypto.createHash("sha512").update(req.body.password + process.env.HASH).digest("hex");

      User.create({
        name: req.body.name,
        id: req.body.id,
        password: hashPassword,
      })
      .then(user => {
        console.log(user);
        res.redirect('/users/login')
      })
      .catch(err => {
        console.log(err);
        res.send(
          '<script>' +
          'alert("알 수 없는 오류");' +
          'location.href = "/";' +
          '</script>'
        );
      });

    }

  });

});

router.get('/profile', (req, res, next) => {

  let session = req.session;

  if(session.user){
    res.render('users/profile', { session: session });
  } else{
    res.redirect('/users/login');
  }

});

router.get('/update', (req, res, next) => {

  let session = req.session;

  if(session.user){
    res.render('users/update', { session: session });
  } else{
    res.redirect('/users/login');
  }

});

router.post('/update', (req, res, next) => {

  let session = req.session;

  let hashPassword = crypto.createHash("sha512").update(req.body.password + process.env.HASH).digest("hex");

  var querySet = User.updateOne({
    name: session.user.name,
    id: session.user.id,
  }, {
    password: hashPassword,
  });

  querySet.exec((err, data) => {

    if(err) return;

    if(data){
      console.log(data);
    }

  });

  res.redirect('/users/profile');

});

module.exports = router;
