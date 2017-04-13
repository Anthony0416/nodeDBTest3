var mongoose = require('mongoose')
var MsgsSchema = require('../schemas/details')
// Msg 是数据库表格的名称， 但会加上 s，即 msgs 
var Detailss = mongoose.model('detail', MsgsSchema)

module.exports = Detailss