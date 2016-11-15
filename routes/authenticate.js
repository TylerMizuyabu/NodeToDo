var router = require('express').Router();

module.exports = function(passport){

    router.user(function(req,res,next){
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
        next();
    });

    router.get('/success', function(req,res,next){
        res.send({status:'success', user: req.user ? req.user:null});
    });

    router.get('/failure', function(req,res,next){
        res.send({status:'failure', user:null});
    });
    
    router.post('/login',passport.authenticate('login',
    {
        successRedirect:'/auth/success',
        failureRedirect:'/auth/failure'
    }));

    router.post('/signup',passport.authenticate('signup',
    {
        successRedirect:'/auth/success',
        failureRedirect:'/auth/failure'
    }));

    router.get('/logout',function(req,res,next){
        req.logout();
        res.redirect('/');
    })

    return router;
}