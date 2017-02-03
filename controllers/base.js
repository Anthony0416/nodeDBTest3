// 增加个方法判断前端传递参数是否正确
exports.checkParams = function(post, params) {
	var re
	// 此处需要转换成JSON，否则胡报错，本地不会，但服务器上就报错了
	var _post = JSON.parse(JSON.stringify(post))
	params.forEach(function(doc, index) {
		if(_post.hasOwnProperty(doc) == true) {
			re = 1
		} else {
			re = {msg: '传递参数错误', code: -1}
		}
	})
	return re
	console.log('判断参数')
}
