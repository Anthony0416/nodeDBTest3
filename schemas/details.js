var mongoose = require('mongoose')

var MsgsSchema = new mongoose.Schema({
  title: {
    unique: true,
    type: [String]
  },
  keywords: [String],
  hot: Boolean,
  pics: [String],
  pics_details: [String],
  prices: [mongoose.Schema.Types.Mixed],
  parameter: Boolean,
  param_details: [mongoose.Schema.Types.Mixed],
  service_date: Number,
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

// middleware 
MsgsSchema.pre('save', function(next) {
  var msg = this
  if (this.isNew) {
    msg.meta.createAt = msg.meta.updateAt = Date.now()
  }
  else {
    msg.meta.updateAt = Date.now()
  }
  console.log('来了')
  next()
})

module.exports = MsgsSchema