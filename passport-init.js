var bCrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){

    passport.serializeUser(function(user, done) {
        return done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            if(err){
                return done(err,false);
            }
            return done(null, user);
        });
    });

    passport.use('login', new LocalStrategy(
        {passReqToCallback: true},
        function(req,username,password,done){
            User.findOne({username:username},function(err,user){
                if(err){
                    return done(err,false);
                }
                if(!user){
                    return done(err,false);
                }
                if(!isValid(user, password)){
                    return done(err, false);
                }
                return done(null, user);
            });
        }
    ));

    passport.use('signup', new LocalStrategy(
        {passReqToCallback: true},
        function(req,username,password,done){
            User.findOne({usrname:username}, function(err,user){
                if(err){
                    return done(err,false);
                }
                if(user){
                    return(err, false);
                }
                
                var newUser = new User();
                newUser.username = username;
                newUser.password = createHash(password);

                newUser.save(function(err,user){
                    if(err){
                        return done(err,false);
                    }
                    return done(null, user);
                });
            })
        }
    ));


    var isValid = function(user,password){
        return bCrypt.compareSync(password, user.password);
    }

    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
    }
}