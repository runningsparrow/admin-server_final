/*
能操作sysplex集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const envSchema = new mongoose.Schema({
  lpar_sysplex: {type: String, required: true},
  envname: {type: String, required: true, default: '国内开发一套'},
  envalias: {type: String},
})

// 3. 定义Model(与集合对应, 可以操作集合)
const EnvModel = mongoose.model('env', envSchema)

// 4. 向外暴露Model
module.exports = EnvModel