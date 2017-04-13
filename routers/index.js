var express = require('express')
var router = express.Router()
var User = require('../controllers/user')
var Msgs = require('../controllers/msgs')
var Base = require('../controllers/base')
var Details = require('../controllers/details')

var home = [
    { name: 'home', description: '我是首页', price: 12.12},
    { name: 'home', description: '我是首页', price: 12.12}
]


router.get('/', checkLogin)
// router.get('/', checkNotLogin)

router.get('/', function(req, res) {
  res.json(home)
});

router.get('/checkLogin', function(req, res) {
  if (req.session.user) {
    res.json({code: 1, msg: '已登录', name: req.session.user.name})
  } else {
    res.json({code: -1, msg: '未登录'})
  }
});

// 和用户相关
// router.get('/reg', checkNotLogin)
router.post('/reg', User.showSignup)

// router.get('/users', checkNotLogin)
// router.get('/users', checkLogin)
router.post('/login', User.showSignin)
router.post('/adminLogin', User.adminLogin)
router.get('/users', User.showUsers)
router.get('/logout',User.logout)

// 和留言相关
router.get('/msgs', Msgs.showMsgs)
router.post('/addmsg', Msgs.addMsgs)

// 和图文详情相关
router.post('/upDetails', Details.upDetails)
router.get('/getLists', Details.getLists)
router.get('/getHots', Details.getHots)
router.get('/getDetails', Details.getDetails)
router.post('/updateDetails', Details.updateDetails)

function checkLogin(req, res, next) {
    if (!req.session.user) {
      console.log('未登入')
      // res.json({msg: '未登入'})
      // req.flash('error', '未登入');
    }
    next();
}
function checkNotLogin(req, res, next) {
    if (req.session.user) {
      console.log('已登入')
      // req.flash('error', '已登入');
    }
    next();
}


module.exports = router
