/*
能操作sysplex集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const plexSchema = new mongoose.Schema({
  plexname: {type: String, required: true},
  use: {type: String, required: true, default: 'sys'},
  total: {type: Number, default: 0},
  used: {type: Number, default: 0},
  free: {type: Number, default: 0}
})

// 3. 定义Model(与集合对应, 可以操作集合)
const PlexModel = mongoose.model('sysplex', plexSchema)

// 4. 向外暴露Model
module.exports = PlexModel