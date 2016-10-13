var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var apiController = require('./controllers/apiController');
var viewController = require('./controllers/viewController');
var jade = require('jade');

var conf = require('./configuration');

mongoose.connect('mongodb://'+ conf.user +':'+ conf.pass +'@ds053176.mlab.com:53176/nodetodom');

app.set('view engine', jade);
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(methodOverride());

apiController(app);
viewController(app);

app.listen();