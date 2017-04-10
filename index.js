var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    crypto = require('crypto'),
    mongoose = require('mongoose'),
    models = require('./models/models'), // 引入模型
    session = require('express-session'),
    moment = require('moment'),
    cookieParser = require('cookie-parser');

var checkLogin = require('./checkLogin.js');

var port = 27017;

var User = models.User,
    Note = models.Note;

// 使用mongoose连接服务
mongoose.connect('mongodb://localhost:' + port + '/notes');
mongoose.connection.on('error', console.error.bind(console, '连接数据库失败'));

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 建立 session 模型
app.use(session({
    secret: '1234',
    name: 'onlinenotebook',
    cookie: {maxAge: 1000 * 60 * 20 },
    resave: true,
    rolling: true,
    saveUninitialized: true
}));

app.get('/', checkLogin.noLogin);

app.get('/', function(req, res) {
    Note.find({author: req.session.user ? req.session.user.username : ''})
        .exec(function(err, allNotes) {
            if (err) {
                console.log(err);
                return res.redirect('/');
            }
            res.render('index', {
                user: req.session.user,
                title: '首页',
                notes: allNotes
            });
        })

});

app.get('/register', function(req, res) {
    console.log('/register');

    if (req.session.user != undefined) {
        res.redirect('/');
    } else {
        res.render('register', {
            user: req.session.user,
            title: '注册',
            success: true
        });  
    }
});

app.post('/register', function(req, res) {
    var username = req.body.username,
        password = req.body.password,
        passwordRepeat = req.body.passwordRepeat;

    // // TODO: 判断输入的用户是否为空，trim去掉空格
    // if (username.trim().length == 0) {
    //     console.log('用户名不能为空!');
    //     return res.redirect('/register');
    // }
    
    // // TODO: 判断输入的密码是否为空，trim去掉空格
    // if (password.trim().length == 0 || passwordRepeat.trim().length == 0) {
    //     console.log('密码不能为空！');
    //     return res.redirect('/register');
    // }
    
    // // TODO: 检验输入两次密码是否一样
    // if (password != passwordRepeat) {
    //     console.log('两次输入的密码不一致！');
    //     return res.redirect('/register');
    // }

    User.findOne({username: username}, function(err, user) {
        if (err) {
            console.log(err);
            // return res.redirect('/register');
            return res.render('register', {
                user: req.session.user,
                title: '注册',
                success: false,
                msg: "注册失败，请重试！"
            });
        }

        if (user) {
            console.log('用户名已存在');
            //return res.redirect('/register');
            return res.render('register', {
                user: req.session.user,
                title: '注册',
                success: false,
                msg: "用户名已存在"
            });
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
                // return res.redirect('/register');
                return res.render('register', {
                    user: req.session.user,
                    title: '注册',
                    success: false,
                    msg: "注册失败，请重试！"
                });
            }
            console.log('注册成功！');
            return res.redirect('/');
        })
    });
});

app.get('/login', function(req, res) {
    console.log('/login');
    if (req.session.user != undefined) {
        res.redirect('/');
    } else {
        res.render('login', {
            user: req.session.user,
            title: '登录'
        });   
    }

});

app.post('/login', function(req, res) {
    var username = req.body.username,
        password = req.body.password,
        weekly = req.body.weekly;

    console.log('login')
    User.findOne({username: username}, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect('/login');
        }

        if (!user) {
            console.log('用户不存在！');
            return res.redirect('/login');
        }

        var md5 = crypto.createHash('md5'),
            md5password = md5.update(password).digest('hex');

        if (user.password !== md5password) {
            console.log('密码错误！');
            return res.redirect('/login');
        }

        if (weekly == 'on') {
            req.session._garbage = Date();
            req.session.touch();  
            req.session.cookie.maxAge = 1000*60*60*24*7;
        }
        
        console.log('登陆成功！');
        user.password = null;
        delete user.password;
        req.session.user = user;
        return res.redirect('/');
    })    
});

app.get('/quit', function(req, res) {
    req.session.user = null;
    console.log('/quit');
    return res.redirect('/login');
});

app.get('/post', function(req, res) {
    console.log('/post');
    if (req.session.user == null) {
        console.log('用户未登录！');
        return res.redirect('/login');
    } else {
        res.render('post', {
            user: req.session.user,
            title: '发布'
        });
    }
});

app.post('/post', function(req, res) {
    var note = new Note({
        title: req.body.title,
        author: req.session.user.username,
        tag: req.body.tag,
        content: req.body.content
    });

    note.save(function(err,doc) {
        if (err) {
            console.log(err);
            return res.redirect('/post');
        }
        console.log('文章发表成功！');
        return res.redirect('/');
    })
});

app.get('/detail/:_id', function(req, res) {
    console.log('/detail');
    Note.findOne({_id: req.params._id})
        .exec(function(err, art) {
            if (err) {
                console.log(err);
                return res.redirect('/');
            }
            if (art) {
                res.render('detail', {
                    title: '笔记详情',
                    user: req.session.user,
                    art: art,
                    moment: moment
                });                  
            }
        })

});


app.listen(3000, function(req, res) {
    console.log('app is running at port 3000');
});