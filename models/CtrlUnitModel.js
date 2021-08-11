/*
能操作device集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const ctrlunitSchema = new mongoose.Schema({
  ctrlunit_number: {type: String, required: true},
  ctrlunit_type: {type: String},
  ctrlunit_cuadd: {type: Number, default: 0},
  ctrlunit_css: {type: Number, default: 0},
  ctrlunit_mc: {type: Number, default: 0},
  ctrlunit_serial: {type: Number, default: 0},
  ctrlunit_description: {type: String},
})

// 3. 定义Model(与集合对应, 可以操作集合)
const ctrlunitModel = mongoose.model('ctrlunit', ctrlunitSchema)

// 4. 向外暴露Model
module.exports = ctrlunitModel