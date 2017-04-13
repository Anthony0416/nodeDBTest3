var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var mongoose = require('mongoose')
mongoose.Promise = Promise

// 增加日志功能
// var morgan = require('morgan')
// var fs = require('fs')
// var FileStreamRotator = require('file-stream-rotator')
// var uuid = require('node-uuid')

// morgan.token('id', function getId(req) {
//   return req.id
// })

var app = express()

//读取本地文件的中间库需要
var multiparty = require('connect-multiparty');
app.use(multiparty());

// 测试
app.set('port', process.env.PORT || 3000)

// var logDirectory = __dirname + '/log'
 
// // ensure log directory exists 
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
 
// // create a rotating write stream 
// var accessLogStream = FileStreamRotator.getStream({
//   date_format: 'YYYYMMDD',
//   filename: logDirectory + '/access-%DATE%.log',
//   frequency: 'daily',
//   verbose: false
// })

// // use custom token formats
// app.use(assignId)
// app.use(morgan(':id :method :status :url :response-time :date[web]', {stream: accessLogStream}))

// function assignId(req, res, next) {
//   req.id = uuid.v4()
//   next()
// }

//这里用户登录的账号，直接存到session里了
app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    secret: 'Harvey',
    keys: ['key1', 'key2'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

var dbUrl = 'mongodb://minerNest:minerNestBoring@120.77.65.204:38250/miner'
// var dbUrl = 'mongodb://test:test@localhost/restdata'
mongoose.connect(dbUrl)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoose opened!');
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");//设置来源域名，*表示所有的都可以请求（危险）
    // res.header("Access-Control-Allow-Origin", "www.lingyun.party");//设置来源域名，*表示所有的都可以请求（危险）
    // res.header("Access-Control-Allow-Origin", "http://www.lingyun.party:88");//设置来源域名，*表示所有的都可以请求（危险）
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Conten-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

var index = require('./routers/index')

app.use('/', index);

app.listen(3000);
console.log('server 3000');

module.exports = app;
