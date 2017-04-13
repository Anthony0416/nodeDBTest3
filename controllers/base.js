// 增加个方法判断前端传递参数是否正确
exports.checkParams = function(post, params) {
	var re
	// 此处需要转换成JSON，否则胡报错，本地不会，但服务器上就报错了
	var _post = JSON.parse(JSON.stringify(post))
	// 此处之前写错，forEach 循环不能使用 break，即有回调函数的不能使用 break
	for(var i=0; i<params.length; i++) {
		if(_post.hasOwnProperty(params[i]) == true) {
			re = 1
		} else {
			re = {msg: '传递参数错误', code: -1}
			break
		}
	}
	// foeEach 循环，如果有 3 个参数，但是最后那一个正确，就会返回 re = 1; 即判断错误
	// params.forEach(function(doc, index) {
	// 	if(_post.hasOwnProperty(doc) == true) {
	// 		re = 1
	// 	} else {
	// 		re = {msg: '传递参数错误', code: -1}
	// 	}
	// })
	return re
	console.log('判断参数')
}
