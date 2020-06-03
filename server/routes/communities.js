var express = require('express');
var router = express.Router();

const Community = require('./../models/communities');

router.get('/list', function(req, res, next) {

    let session = req.session;

    console.log(req.query)

    if(req.query.search){

        const option = req.query.option;
        const value = req.query.search;

        switch (option) {
            case "user_name":
                console.log("username")
                var querySet = Community.find({user_name: {$regex : `.*${value}.*`}});
                break;
                
            case "user_id":
                console.log("userid")
                var querySet = Community.find({user_id: {$regex : `.*${value}.*`}});
                break;
            case "title":
                console.log("title")
                var querySet = Community.find({title: {$regex : `.*${value}.*`}});
                break;
            case "content":
                console.log("content")
                var querySet = Community.find({content: {$regex : `.*${value}.*`}});
                break;
        }

        querySet.exec((err, data) => {
        
            if(err){
                res.redirect('/');
                return;
            }
                
            res.render('communities/list', { session: session, data: data });
            
        });

    }else{

        var querySet = Community.find({});

        querySet.exec((err, data) => {
        
            if(err){
                res.redirect('/');
                return;
            }
                
            res.render('communities/list', { session: session, data: data });
            
        });

    }

});

router.get('/new', (req, res, next) => {
   
    let session = req.session;

    if(session.user){
        res.render('communities/new', { session: session })
    }else{
        res.redirect('/users/login');
    }

});

router.post('/new', (req, res, next) => {

    Community.create({
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        title: req.body.title,
        content: req.body.content,
    })
    .then(community => {
        res.redirect('/communities/list');
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

});

router.get('/detail/:id', (req, res, next) => {

    let session = req.session;

    var querySet = Community.findOne({
        _id: req.params.id
    });
    
    querySet.exec((err, data) => {
    
        if(err){
            res.redirect('/');
            return;
        }
            
        res.render('communities/detail', { session: session, data: data });
        
    });    

});

router.get('/update/:id', (req, res, next) => {

    let session = req.session;

    var querySet = Community.findOne({
        _id: req.params.id
    });
    
    querySet.exec((err, data) => {
    
        if(err){
            res.redirect('/');
            return;
        }
            
        if(data){
            if(session.user){
                if(session.user.id == data.user_id){
                    res.render('communities/update', { session: session, data: data });
                } else{
                    res.redirect('/');
                }
            }else{
                res.redirect('/');
            }
        }else{
            res.send(
                '<script>' +
                'alert("알 수 없는 오류");' +
                'location.href = "/";' +
                '</script>'
            );
        }
        
    });    

});

router.post('/update/:id', (req, res, next) => {

    var querySet = Community.updateOne({
        _id: req.params.id
      }, {
        title: req.body.title,
        content: req.body.content
      });
    
    querySet.exec((err, data) => {
    
        if(err) return;
    
    });

    res.redirect('/communities/list');

});

module.exports = router;
