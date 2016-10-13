var Todo = require('../models/todo');

module.exports = function(app){
    app.get('/api/todos', function(req,res){
        Todo.find(function(err,todos){
            if(err) throw err;
            res.json(todos);
        });
    });

    app.post('/api/todos',function(req,res){
        Todo.create({
            text: req.body.text,
            done:false
        },function(err,todo){
            if(err) res.send(err);
            res.json(todo);
        })

        //Todo.find(function(err,todos){
        //    if(err) res.send(err);

        //    res.json(todos);
       // })
    });

    app.delete('/api/todos/:id',function(req,res){
        Todo.remove({
            _id : req.params.id
        },function(err,todo){
            if(err) throw err;

            Todo.find(function(err,todos){
                if(err) throw err;
                res.json(todos);
            });
        });
    });
}