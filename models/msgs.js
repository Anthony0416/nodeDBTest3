var mongoose = require('mongoose')
var MsgsSchema = require('../schemas/msgs')
// Msg 是数据库表格的名称， 但会加上 s，即 msgs 
var Msgs = mongoose.model('Msg', MsgsSchema)

module.exports = Msgs