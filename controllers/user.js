var User = require('../models/user')
var Base = require('./base')

function Users(user) {
    this.name = user.name
}

exports.showSignup = function(req, res) {
	var _user = req.body
	var _params = ['name', 'password', 'passwordRepeat']
	var check = Base.checkParams(_user, _params)
	if(check === 1) {
		//注册时，判断用户是否已注册
		User.findOne({name:_user.name}, function(err, user) {
			if(err) {
				console.log(err);
			}
			if(user) {
				res.json({msg: '用户已存在', code: -1})
			} else {
				if(_user.password !== _user['passwordRepeat']) {
					res.json({msg: '两次输入密码不一致', code: -1})
				} else {
					var user = new User(_user);
					user.save(function(err,user) {
						if(err) {
							console.log(err);
						} else {
							res.json({msg: '注册成功', code: 1})
						}
					})
				}
			}
		})
	} else {
		res.json(check)
	}
}

exports.showUsers = function(req,res) {
	// res.json({users: '444'})
	User.find({}, function(err, user) {
		if(err) {
			console.log(err)
		}
		var users = []
		user.forEach(function(doc, index) {
			var user = new Users(doc)
    	users.push(user);
		})
		res.json(users)
	})
}

exports.showSignin = function(req,res) {
	var _user = req.body;
	var _params = ['name', 'password']
	var check = Base.checkParams(_user, _params)
	var name = _user.name;
	var password = _user.password;

	if(check == 1) {
		User.findOne({name:name},function(err,user) {
			if(err) {
				console.log(err);
			}
			
			if(!user) {
				res.json({msg: '用户不存在', code: -1})
				// return res.redirect('/signup');
			}
			user.comparePassword(password,function(err,isMatch) {
				if(err) {
					console.log(err);
				}
				
				if(isMatch) {
					req.session.user = user;
					// console.log(121)
					res.json({msg: '登陆成功', code: 1})
				} else {
					res.json({msg: '密码不正确', code: -1})
				}
			})
		})
	} else {
		res.json(check)
	}
}

// 后台管理界面登录
exports.adminLogin = function(req,res) {
	var _user = req.body;
	var _params = ['name', 'password']
	var check = Base.checkParams(_user, _params)
	var name = _user.name;
	var password = _user.password;

	if(check == 1) {
		User.findOne({name:name},function(err,user) {
			if(err) {
				console.log(err);
			}
			
			if(!user) {
				res.json({msg: '用户不存在', code: -1})
				// return res.redirect('/signup');
			}
			user.comparePassword(password,function(err,isMatch) {
				if(err) {
					console.log(err);
				}
				
				if(isMatch && user.role > 10) {
					req.session.user = user;
					res.json({msg: '登陆成功', code: 1})
				} else {
					res.json({msg: '密码不正确或权限不够', code: -1})
				}
			})
		})
	} else {
		res.json(check)
	}
}

exports.logout = function(req,res) {
	//	delete app.locals.user;
	delete req.session.user;
	res.json({msg: '注销登陆成功', code: 1})
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