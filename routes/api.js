var mongoose = require('mongoose');
var Todo = mongoose.model('Todo');
var User = mongoose.model('User');
var ObjectId = require('mongoose').Types.ObjectId; 
var router = require('express').Router();

router.use('/todos',function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.send({status:'unauthorized'});
    });

router.get('/todos/:user',function(req,res){ 
        Todo.find({created_by: new ObjectId(req.params.user)},function(err,todos){
            if(err) return res.json({status:'failure',error:err});
            return res.json(todos);
        });
    });

router.route('/todos')

    .post(function(req,res){
        var newTodo = new Todo();
        newTodo.text = req.body.text;
        newTodo.done = false;
        User.findOne({_id:req.body.created_by},function(err,user){
            if(err){
                return res.jason({status:'failure',error:err});
            }
            if(!user){
                return res.json({status:'failure', error:"User not found"});
            }
            newTodo.created_by = user._id;
            newTodo.save(function(err,todo){
                if(err){
                    return res.jason({status:'failure',error:err});
                }
                if(!todo){
                    return res.json({status:'failed', error:"Failed to save todo"});
                }
                return res.json({status:'success',todo});
            });
        });
    })

    .delete(function(req,res){
        Todo.findOne({_id:req.body.id},function(err,todo){
            if(err){
                return res.json({status:'failure',error:err});
            }
            if(!todo){
                return res.json({status:'failure', error:"todo not found"});
            }
            if(todo.created_by != req.body.user){
                return res.json({status:'failed', error:'Insufficient Permissions'});
            }
            todo.remove(function(err,rslt){
                if(err){
                    return res.jason({status:'failure',error:err});
                }
                return res.json({status:'success', rslt});
            });
        })
    });

module.exports = router;