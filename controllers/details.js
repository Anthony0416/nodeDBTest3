var fs = require('fs')
var path = require('path')
var qn = require('qn')
var Details = require('../models/details')
var Base = require('./base')
var Q = require('q')

// 上传文件到七牛
var client = qn.create({
  accessKey: 'I9RUdgNZOaiY-F16n2pPB9tsQ1fkN8EIR-rtpyKy',
  secretKey: 'p_RhQXgOhkOPms_x6iKZKj5ONsa8S-ElRqRNopFZ',
  bucket: 'ldfminer',
  origin: 'http://up-z2.qiniu.com/',
  timeout: 3600000, // default rpc timeout: one hour, optional 
  // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/` 
  uploadURL: 'http://up-z2.qiniu.com/',
});

function uploadFile(filePath, poster) {
  var deferred = Q.defer()

   client.uploadFile(filePath, {key: poster}, function(err, result) {
    if (err) {
      deferred.reject(err)
    } // rejects the promise with `er` as the reason
    else {
      deferred.resolve(result)
    } // fulfills the promise with `data` as the value
  })

  return deferred.promise // the promise is returned
}

function saveDB(req, res, _msg) {
  var deferred = Q.defer()
  // 把相关数据存到数据库

  var details = new Details(_msg)
  details.save(function(err,msg) {
    if(err) {
      deferred.reject(err)
    } else {
      deferred.resolve(msg)
    }
  })
  return deferred.promise
}

// 上传矿机图片和文字详情
exports.upDetails = function(req, res) {
  // 把前端传来的数据格式化，再存入数据库
  console.log(req.body)
  var reqBody = req.body
  var _msg = {}
  _msg.title = []
  _msg.title.push(reqBody.title)
  _msg.title.push(reqBody.title_en)
  _msg.keywords = []
  if(reqBody.keyWords) {
    _msg.keywords.push(reqBody.keyWords)
    _msg.keywords.push(reqBody.keyWords_en)
  }
  _msg.hot = (reqBody.hot == 'on') ? true : false
  _msg.pics = []
  _msg.pics_details = []
  _msg.prices = []
  if(reqBody.standard1) {
    var _standard1 = {
      standard: [reqBody.standard1, reqBody.standard1_en],
      price: [reqBody.price1, reqBody.price1_en]
    }
     _msg.prices.push(_standard1)
  }
  if(reqBody.standard2) {
    var _standard2 = {
      standard: [reqBody.standard2, reqBody.standard2_en],
      price: [reqBody.price2, reqBody.price2_en]
    }
     _msg.prices.push(_standard2)
  }
  if(reqBody.standard3) {
    var _standard3 = {
      standard: [reqBody.standard3, reqBody.standard3_en],
      price: [reqBody.price3, reqBody.price3_en]
    }
     _msg.prices.push(_standard3)
  }
  // parameter 判断矿机是否有表格参数详情
  _msg.parameter = (reqBody.parameter == 'on') ? true : false
  _msg.param_details = []
  if(_msg.parameter) {
    var _details = {
      Hash_Rate: reqBody.Hash_Rate,//额定算力
      Total_Hash: reqBody.Total_Hash,//整机算力
      Power_Consumption: reqBody.Power_Consumption,//墙上功耗
      Power_Efficiency: reqBody.Power_Efficiency,//电源效率
      Input_Voltage: reqBody.Input_Voltage,//输入电压
      Rated_Voltage: reqBody.Rated_Voltage,//额定电压
      EER: reqBody.EER,//能耗比
      Chips_Per_Unit: reqBody.Chips_Per_Unit,//显卡数量
      Number_Chips: reqBody.Number_Chips,//芯片数量
      Operation_Panel: reqBody.Operation_Panel,//运算板数量
      Overclock: reqBody.Overclock,//超频
      Dimensions: reqBody.Dimensions,//外形尺寸
      Weight: reqBody.Weight,//整机重量
      Cooling: reqBody.Cooling,//冷却
      Operating_Temperature: reqBody.Operating_Temperature,//工作温度
      Operating_Humidity: reqBody.Operating_Humidity,//工作湿度
      Noise_Specifications: reqBody.Noise_Specifications,//噪音
      Network_Connection: reqBody.Network_Connection,//网络连接
      Power_Interface: reqBody.Power_Interface,//电源接口
      Connection_Supply: reqBody.Connection_Supply,//电源连接方式
    }
    var _details_en = {
      Hash_Rate_en: reqBody.Hash_Rate_en,//额定算力
      Total_Hash_en: reqBody.Total_Hash_en,//整机算力
      Power_Consumption_en: reqBody.Power_Consumption_en,//墙上功耗
      Power_Efficiency_en: reqBody.Power_Efficiency_en,//电源效率
      Input_Voltage_en: reqBody.Input_Voltage_en,//输入电压
      Rated_Voltage_en: reqBody.Rated_Voltage_en,//额定电压
      EER_en: reqBody.EER_en,//能耗比
      Chips_Per_Unit_en: reqBody.Chips_Per_Unit_en,//显卡数量
      Number_Chips_en: reqBody.Number_Chips_en,//芯片数量
      Operation_Panel_en: reqBody.Operation_Panel_en,//运算板数量
      Overclock_en: reqBody.Overclock_en,//超频
      Dimensions_en: reqBody.Dimensions_en,//外形尺寸
      Weight_en: reqBody.Weight_en,//整机重量
      Cooling_en: reqBody.Cooling_en,//冷却
      Operating_Temperature_en: reqBody.Operating_Temperature_en,//工作温度
      Operating_Humidity_en: reqBody.Operating_Humidity_en,//工作湿度
      Noise_Specifications_en: reqBody.Noise_Specifications_en,//噪音
      Network_Connection_en: reqBody.Network_Connection_en,//网络连接
      Power_Interface_en: reqBody.Power_Interface_en,//电源接口
      Connection_Supply_en: reqBody.Connection_Supply_en,//电源连接方式
    }
    _msg.param_details.push(_details)
    _msg.param_details.push(_details_en)
  }
  _msg.service_date = reqBody.service_date

  var files = req.files
  var _params = ['title', 'keyWords']

  var check = Base.checkParams(reqBody, _params)
  
  // 判断是否上传图片
  var hasFiles = files['uploadPoster1'].originalFilename || files['uploadPoster2'].originalFilename || files['uploadPoster3'].originalFilename
  if (hasFiles) {
    // 判断传递参数是否正确
    if(check === 1) {
      var upFilesArr = []

      for(var i in files) {
        // 判断是否上传文件
        if(files[i].originalFilename) {
          // 判断是否上传文件是否 jpeg 和 png
          if(files[i].type && (files[i].type == 'image/png' || files[i].type == 'image/jpeg')) {
            (function(i) {
              var posterData = files[i]
              var filePath = posterData.path
              var timestamp = Date.now()
              var poster = timestamp + '.' + files[i].originalFilename

              upFilesArr.push(uploadFile(filePath, poster))

              if(i.indexOf('uploadPoster') > -1) {
                _msg.pics.push('http://olnw3n8y1.bkt.clouddn.com/'+ poster)
              } else {
                _msg.pics_details.push('http://olnw3n8y1.bkt.clouddn.com/'+ poster)
              }
            })(i)
          } else {
            res.set('Content-Type', 'text/html')
            res.send(new Buffer('<script type="text/javascript"> document.domain = "www.lingyun.party"; parent.noPngOrJpeg() </script>'))
            // res.json({code: -1, msg: '上传的文件非 png 或 jpeg'})
            break
          }
        }
        
        
      }

      // 等待所以图片上传到七牛，才进行数据库保存，并返回状态给前端，
      // 这里需要注意：本地提前返回状态给前端，是可以把所有图片上传到七牛的，
      // 而在服务器上却不行，所以需借助 promise 把所有图片上传，然后再存入数据库
      
      saveDB(req, res, _msg).then(function() {
        var allPromise = Q.all(upFilesArr)
        allPromise.then(function() {
           res.set('Content-Type', 'text/html')
          res.send(new Buffer('<script type="text/javascript"> document.domain = "www.lingyun.party"; parent.success() </script>'))
          // res.json({code: 1, msg: '上传成功'})
        }, console.error)
      }, function(err) {
        if(err.code == 11000) {
          res.set('Content-Type', 'text/html')
          res.send(new Buffer('<script type="text/javascript"> document.domain = "www.lingyun.party"; parent.duplicate() </script>'))
          // res.json({code: -1, msg: '上传标题已重复'})
        } else {
          res.set('Content-Type', 'text/html')
          res.send(new Buffer('<script type="text/javascript"> document.domain = "www.lingyun.party"; parent.fail() </script>'))
          // res.json({code: 1, msg: '上传失败'})
        }
        
      })

    } else {
      res.set('Content-Type', 'text/html')
      res.send(new Buffer('<script type="text/javascript"> document.domain = "www.lingyun.party"; parent.errParam() </script>'))
      // res.json(check)
    }
  } else {
    res.set('Content-Type', 'text/html')
    res.send(new Buffer('<script type="text/javascript"> document.domain = "www.lingyun.party"; parent.nofile() </script>'))
    // res.json({code: -1, msg: '未上传图片'})
  }

}

// 根据矿机 _id 获取图片和文字详情
exports.getDetails = function(req, res) {
  
  var _params = ['id']
  var check = Base.checkParams(req.query, _params)

  if(check === 1) {
    Details.findById(req.query.id, function(err, details) {
      if(err) {
        console.log(err);
        res.json(err)
      }
      res.json(details)
    })
  } else {
    res.json(check)
  }
}

// 获取产品列表
exports.getLists = function(req, res) {
  Details.find({}, function(err, details) {
    if(err) {
      console.log(err)
      res.json(err)
    } else {
      console.log(details)
      res.json(details)
    }
    
  })
}

// 获取热门产品列表
exports.getHots = function(req, res) {
  Details.find({hot: true}, null,{ limit: 2}, function(err, details) {
    if(err) {
      console.log(err)
      res.json(err)
    }
    console.log(details)
    res.json(details.reverse())
  })
}

// 修改商品详情，只可以修改文字信息，如果需要修改图片，需重新再增加新商品
exports.updateDetails = function(req, res) {
  Details.findById(req.query.id, function(err, detail) {
    if(err) {
      console.log(err)
      res.json(err)
    }
    var _id = detail._id; //需要取出主键_id
    delete detail._id;    //再将其删除
    detail.title[0] = '测试点';
    Details.update({_id: _id}, detail, function(err) {
      if(err) {
        console.log(err)
      }
      console.log('success')
      res.json({code: 1, msg: '修改成功'})
    });
  })

}
