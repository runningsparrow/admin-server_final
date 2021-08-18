/*
能操作device集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const disktypeSchema = new mongoose.Schema({
  disk_type: {type: String, required: true},
  disk_size: {type: Number, required: true},
})

// 3. 定义Model(与集合对应, 可以操作集合)
const DiskTypeModel = mongoose.model('disktype', disktypeSchema)

// 4. 向外暴露Model
module.exports = DiskTypeModel