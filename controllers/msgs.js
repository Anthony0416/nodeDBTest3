var Msgs = require('../models/msgs')
var Base = require('./base')
// var moment = require('moment')


function Msg(msgsObj) {
  this.msg = msgsObj.msg
  this.phone = msgsObj.phone
  this.action = msgsObj.action
  this.time = msgsObj.meta.updateAt
  this.name = (msgsObj.name == '') ? null : msgsObj.name
  this.email = (msgsObj.email == '') ? null : msgsObj.email
}

// exports.showSignup = function(req, res) {
// 	var _user = req.body
// 	var _params = ['name', 'password', 'passwordRepeat']
// 	var check = Base.checkParams(_user, _params)
// 	if(check) {
// 		//注册时，判断用户是否已注册
// 		User.findOne({name:_user.name}, function(err, user) {
// 			if(err) {
// 				console.log(err);
// 			}
// 			if(user) {
// 				res.json({msg: '用户已存在', code: -1})
// 			} else {
// 				if(_user.password !== _user['passwordRepeat']) {
// 					res.json({msg: '两次输入密码不一致', code: -1})
// 				} else {
// 					var user = new User(_user);
// 					user.save(function(err,user) {
// 						if(err) {
// 							console.log(err);
// 						}
// 						res.json({msg: '注册成功', code: 1})
// 					})
// 				}
// 			}
// 		})
// 	} else {
// 		res.json({msg: '传递参数错误', code: -1})
// 	}
// }

exports.showMsgs = function(req,res) {
	// console.log(moment(new Date()).format("YYYY-MM-DD hh:mm:ss a"))
	Msgs.find({}, function(err, msg) {
		if(err) {
			console.log(err)
		}
		var msgs = []
		msg.reverse().forEach(function(doc, index) {
			var msg = new Msg(doc)
    	msgs.push(msg);
		})
		res.json(msgs)
	})
}

exports.addMsgs = function(req,res) {
	var _msg = req.body
	var _params = ['msg', 'phone']

	var check = Base.checkParams(_msg, _params)

	if(check === 1) {
		var msg = new Msgs(_msg)
		msg.save(function(err,msg) {
			if(err) {
				console.log(err);
				res.json({msg: '留言失败', code: -1})
			} else {
				res.json({msg: '留言成功', code: 1})
			}
			
		})
	} else {
		res.json(check)
	}
}

// //userlist page
// exports.list = function(req,res) {
// 	User.fetch(function(err, users) {
// 		if (err) {
// 			console.log(err)
// 		}

// 	  res.render('userlist', {
// 	  	title: 'web 用户页',
// 	  	users: users
// 	  })
	  
// 	})
	
// }

// //middleware for user
// exports.signinRequired = function(req,res,next) {
// 	var user = req.session.user
	
// 	if(!user) {
// 		return res.redirect('/signin')
// 	}
	
// 	next()
// }

// exports.adminRequired = function(req,res,next) {
// 	var user = req.session.user
	
// 	if(user.role <= 10) {
// 		return res.redirect('/signin')
// 	}
	
// 	next()
// }