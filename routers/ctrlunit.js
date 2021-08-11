cosnt CtrlUnitModel = require('../models/CtrlUnitModel')


//CtrlUnitModel 增删改查

// 添加control unit


  ctrlunit_number: {type: String, required: true},
  ctrlunit_type: {type: String},
  ctrlunit_cuadd: {type: Number, default: 0},
  ctrlunit_css: {type: Number, default: 0},
  ctrlunit_mc: {type: Number, default: 0},
  ctrlunit_serial: {type: Number, default: 0},
  ctrlunit_description: {type: String},

/**
 * 添加一个 control unit
 * @route POST /manage/ctrlunit/add
 * @group ctrlunit 控制单元 - Operations about device
 * @consumes application/x-www-form-urlencoded
 * @param {string} ctrlunit_number.formData.required
 * @param {string} ctrlunit_type.formData
 * @param {number} ctrlunit_cuadd.formData
 * @param {number} ctrlunit_css.formData
 * @param {number} ctrlunit_mc.formData
 * @param {number} ctrlunit_serial.formData
 * @param {string} ctrlunit_description.formData
 * @returns {object} 200 - An array of device info
 * @returns {Error}  default - Unexpected error
 */
// router.post('/manage/ctrlunit/add', (req, res) => {
exports.ctrlunitadd = function(req, res){
  // 读取请求参数数据
  const {ctrlunit_number} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  CtrlUnitModel.findOne({ctrlunit_number})
    .then(ctrlunit => {
      // 如果user有值(已存在)
      if (ctrlunit) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此controlunit已存在'})
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        return CtrlUnitModel.create({...req.body})
      }
    })
    .then(ctrlunit => {
      // 返回包含user的json数据
      res.send({status: 0, data: ctrlunit})
    })
    .catch(error => {
      console.error('添加ctrlunit异常', error)
      res.send({status: 1, msg: '添加ctrlunit异常, 请重新尝试'})
    })
}