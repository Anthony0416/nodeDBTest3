var express = require('express')
var router = express.Router()
var User = require('../controllers/user')
var Msgs = require('../controllers/msgs')
var Base = require('../controllers/base')

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


// router.get('/reg', checkNotLogin)
router.post('/reg', User.showSignup)

// router.get('/users', checkNotLogin)
// router.get('/users', checkLogin)
router.post('/login', User.showSignin)
router.get('/users', User.showUsers)
router.get('/logout',User.logout)

// router.get('/users', function(req, res) {
//   Users.get(null, function(err, posts) {
//         if (err) {
//             posts = [];
//         }
//         // console.log(posts)
//         res.json(posts)
//     });
// });

// router.post('/adduser', function(req, res) {
//     //这里 req.body 需要使用 body-parser 模块才能获取到数据
//     // console.log(req.body)
//     res.send(
//       {msg: req.body.msg}
//     )
//     var newUser = new Users({
//         msg: req.body.msg,
//     });
//     newUser.save(function(err, posts) {
//         if (err) {
//             posts = [];
//         }
//         console.log(posts)
//         res.json(posts)
//     });
// });
router.get('/msgs', Msgs.showMsgs)
// router.get('/msgs', function(req, res) {
//   Msgs.get(null, function(err, msgs) {
//     if (err) {
//         msgs = [];
//     }
//     // console.log(msgs)
//     res.json(msgs)
//   });
// });
router.post('/addmsg', Msgs.addMsgs)
// router.post('/addmsg', function(req, res) {
//     var _params = ['msg']
//     var check = Base.checkParams(req.body, _params)

//     if(check) {
//       var newMsg = new Msgs(req.body.msg, req.body.time, req.body.action);
//       newMsg.save(function(err, msgs) {
//           if (err) {
//               msgs = [];
//           }
//           // console.log(msgs)
//           res.json(msgs)
//       });
//     } else {
//       res.json({msg: '传递参数错误', code: -1})
//     }
// });


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
