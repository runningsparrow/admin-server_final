const CtrlUnitModel = require('../models/CtrlUnitModel')


//CtrlUnitModel 增删改查

// 添加control unit



/**
 * 添加一个 control unit
 * @route POST /manage/ctrlunit/add
 * @group ctrlunit 控制单元 - Operations about ctrlunit
 * @consumes application/x-www-form-urlencoded
 * @param {string} ctrlunit_number.formData.required
 * @param {string} ctrlunit_type.formData
 * @param {string} ctrlunit_cuadd.formData
 * @param {number} ctrlunit_css.formData
 * @param {number} ctrlunit_mc.formData
 * @param {number} ctrlunit_serial.formData
 * @param {string} ctrlunit_description.formData
 * @returns {object} 200 - An array of ctrlunit info
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




// 更新ctrlunit
/**
 * 更新一个 ctrlunit
 * @route POST /manage/ctrlunit/update
 * @group ctrlunit 控制单元 - Operations about ctrlunit
 * @consumes application/x-www-form-urlencoded
 * @param {string} ctrlunit_number.formData.required
 * @param {string} ctrlunit_type.formData
 * @param {string} ctrlunit_cuadd.formData
 * @param {number} ctrlunit_css.formData
 * @param {number} ctrlunit_mc.formData
 * @param {number} ctrlunit_serial.formData
 * @param {string} ctrlunit_description.formData
 * @returns {object} 200 - An array of ctrlunit info
 * @returns {Error}  default - Unexpected error
 */
// router.post('/manage/lpar/update', (req, res) => {
exports.ctrlunitupdate = function(req, res){
  const ctrlunit = req.body
  // 此种写法也可以
  // LparModel.findOneAndUpdate({lpar_id: lpar.lpar_id}, Object.assign({}, lpar)) 
  CtrlUnitModel.findOneAndUpdate({ctrlunit_number: ctrlunit.ctrlunit_number}, ctrlunit)
    .then(oldCtrlUnit => {
      const data = Object.assign(oldCtrlUnit, ctrlunit)
      // 返回
      res.send({status: 0, data})
    })
    .catch(error => {
      console.error('更新ctrlunit异常', error)
      res.send({status: 1, msg: '更新ctrlunit异常, 请重新尝试'})
    })
}




// 删除ctrlunit
/**
 * 删除一个 ctrlunit
 * @route POST /manage/ctrlunit/delete
 * @group ctrlunit 控制单元 - Operations about ctrlunit
 * @consumes application/x-www-form-urlencoded
 * @param {string} ctrlunit_number.formData.required
 * @returns {object} 200 - An array of ctrlunit info
 * @returns {Error}  default - Unexpected error
 */
// router.post('/manage/lpar/delete', (req, res) => {
exports.ctrlunitdelete = function(req, res){
  const {ctrlunit_number} = req.body
  CtrlUnitModel.deleteOne({ctrlunit_number: ctrlunit_number})
    .then((doc) => {
      if(doc.n >= 1)
      {
        res.send({status: 0,msg: '删除成功',result: doc, ctrlunit_number:ctrlunit_number})
      }
      if(doc.n == 0)
      {
        res.send({status: 0,msg: '未找到需要删除的数据',result: doc, ctrlunit_number:ctrlunit_number})
      }
      
    })
    .catch(error => {
      console.error('删除device异常', error)
      res.send({status: 1, msg: '删除device异常, 请重新尝试'})
    })
}



//查询设备列表
/**
 * 查询 device 列表
 * @route POST /manage/ctrlunit/list
 * @group ctrlunit 控制单元 - Operations about ctrlunite
 * @consumes application/x-www-form-urlencoded
 * @returns {object} 200 - An array of ctrlunit info
 * @returns {Error}  default - Unexpected error
 */
// router.get('/manage/device/list', (req, res) => {
exports.ctrlunitlist = function(req, res){
  CtrlUnitModel.find()
    .then(ctrlunits => {
      res.send({status: 0, data: ctrlunits})
    })
    .catch(error => {
      console.error('获取ctrlunit列表异常', error)
      res.send({status: 1, msg: '获取ctrlunit列表异常, 请重新尝试'})
    })
}



//查询ctrlunit by ctrlunit_number
/**
 * 通过 ctrlunit_number 查询一个 ctrlunit
 * @route POST /manage/ctrlunit/querybyctrlunit
 * @group ctrlunit 控制单元 - Operations about ctrlunite
 * @consumes application/x-www-form-urlencoded
 * @param {string} ctrlunit_number.formData.required
 * @returns {object} 200 - An array of ctrlunit info
 * @returns {Error}  default - Unexpected error
 */
// router.post('/manage/device/querybydevice', (req, res) => {
exports.ctrlunitquerybyctrlunit = function(req, res){
  // 读取请求参数数据
  const {ctrlunit_number} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  CtrlUnitModel.findOne({ctrlunit_number})
    .then(ctrlunit => {
      // 如果user有值(已存在)
      if (ctrlunit) {
        // 返回包含user的json数据
        res.send({status: 0, data: ctrlunit})
      } else { // 没值(不存在)
        res.send({status: 1, msg: '查询ctrlunit异常, 请重新尝试'})
      }
    })
}