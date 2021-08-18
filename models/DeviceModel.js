/*
能操作device集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const deviceSchema = new mongoose.Schema({
  device_number: {type: String, required: true},
  device_volser: {type: String, required: true},
  device_cu_nunmber: {type: String, required: true},
  device_sysplex: {type: String},
  device_type: {type: String},
  device_ser: {type: String},
  device_ssid: {type: Number},
  device_sms: {type: String},
  device_sg: {type: String},
  device_full: {type: Number, default: 0},
  device_sysshr1: {type: Number, default: 0},
  device_sysshr2: {type: Number, default: 0}
})

// 3. 定义Model(与集合对应, 可以操作集合)
const DeviceModel = mongoose.model('device', deviceSchema)

// 4. 向外暴露Model
module.exports = DeviceModel