var mongoose = require('mongoose')
var moment = require('moment')

var MsgsSchema = new mongoose.Schema({
  // id: {
  //   unique: true,
  //   type: Number
  // },
  msg: String,
  phone: Number,
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  // action 
  // 0 表示未处理
  // 1 表示已经处理
  action: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

MsgsSchema.pre('save', function(next) {
  var msg = this
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  next()
})

MsgsSchema.methods = {
  // comparePassword: function(_password, cb) {
  //   bcrypt.compare(_password, this.password, function(err, isMatch) {
  //     if (err) return cb(err)

  //     cb(null, isMatch)
  //   })
  // }
}


MsgsSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = MsgsSchema