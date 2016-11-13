var mongoose = require('mongoose');
var Schema = mongoose.Schema

var newUser = new Schema({
    username: String,
    password: String
})

mongoose.model('User',newUser);

var newTodo = new Schema({
    text:String,
    created_by: {type: Schema.ObjectId, ref:'User'}
});

mongoose.model('Todo', newTodo)



