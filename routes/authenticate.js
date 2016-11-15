var router = require('express').Router();

module.exports = function(passport){

    router.use(function(req,res,next){
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

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