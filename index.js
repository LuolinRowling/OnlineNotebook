var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    crypto = require('crypto');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.render('index', {
        title: '首页'
    });
});

app.get('/login', function(req, res) {
    console.log('/login');
    
});

app.listen(3000, function(req, res) {
    console.log('app is running at port 3000');
});