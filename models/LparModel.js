/*
能操作sysplex集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const lparSchema = new mongoose.Schema({
    lpar_id: {type: Number, required: true},
    lpar_name: {type: String, required: true},
    lpar_sysplex: {type: String, default: ''},
    lpar_sysname: {type: String, default: ''},
    lpar_boxname: {type: String, default: ''},
    lpar_css: {type: Number, default: 0},
    lpar_type: {type: String, default: ''},
    lpar_version: {type: String, default: ''},
    lpar_status: {type: Number, default: 0},
    lpar_lcp_num: {type: Number, default: 0},
    lpar_ziip_num: {type: Number, default: 0},
    lpar_icf_num: {type: Number, default: 0},
    lpar_lcp_num_shared: {type: Number, default: 0},
    lpar_ziip_num_shared: {type: Number, default: 0},
    lpar_icf_num_shared: {type: Number, default: 0},
    lpar_lcp_weight: {type: Number, default: 0},
    lpar_ziip_weight: {type: Number, default: 0},
    lpar_icf_weight: {type: Number, default: 0},
    lpar_central_storage: {type: Number, default: 0},
    lpar_reverse_storage: {type: Number, default: 0},
  })
  
  // 3. 定义Model(与集合对应, 可以操作集合)
  const LparModel = mongoose.model('lpar', lparSchema)
  
  // 4. 向外暴露Model
  module.exports = LparModel