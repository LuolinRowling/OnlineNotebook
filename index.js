var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    models = require('./models/models'); // 引入模型

var port = 27017;

var User = models.User;

// 使用mongoose连接服务
mongoose.connect('mongodb://localhost:' + port + '/notes');
mongoose.connection.on('error', console.error.bind(console, '连接数据库失败'));

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

app.get('/register', function(req, res) {
    console.log('/register');
    res.render('register', {
        title: '注册'
    });   
});

app.post('/register', function(req, res) {
    var username = req.body.username,
        password = req.body.password,
        passwordRepeat = req.body.passwordRepeat;

    User.findOne({username: username}, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect('/register');
        }

        if (user) {
            console.log('用户名已存在');
            return res.redirect('/register');
        }

        var md5 = crypto.createHash('md5'),
            md5password = md5.update(password).digest('hex');

        var newUser = new User({
            username: username,
            password: md5password
        });

        newUser.save(function(err, doc) {
            if (err) {
                console.log(err);
                return res.redirect('/register');
            }
            console.log('注册成功！');
            return res.redirect('/');
        })
    });
});

app.get('/login', function(req, res) {
    console.log('/login');
    res.render('login', {
        title: '登录'
    });   
});

app.get('/quit', function(req, res) {
    console.log('/quit');
    return res.redirect('/login');
});

app.get('/post', function(req, res) {
    console.log('/post');
    res.render('post', {
        title: '发布'
    });   
});

app.get('/detail/', function(req, res) {
    console.log('/detail');
    res.render('detail', {
        title: '查看笔记'
    });   
});

app.listen(3000, function(req, res) {
    console.log('app is running at port 3000');
});