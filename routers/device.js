//20210806
const Devicemodel = require('../models/DeviceModel')

//DeviceModel 增删改查

// 添加设备


/**
 * 添加一个 device
 * @route POST /manage/device/add
 * @group deviceobj - Operations about device
 * @consumes application/x-www-form-urlencoded
 * @param {string} device_number.formData.required
 * @returns {object} 200 - An array of device info
 * @returns {Error}  default - Unexpected error
 */
// router.post('/manage/device/add', (req, res) => {
exports.deviceadd = function(req, res){
  // 读取请求参数数据
  const {device_number} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  DeviceModel.findOne({device_number})
    .then(device => {
      // 如果user有值(已存在)
      if (device) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此device已存在'})
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        return DeviceModel.create({...req.body})
      }
    })
    .then(device => {
      // 返回包含user的json数据
      res.send({status: 0, data: device})
    })
    .catch(error => {
      console.error('添加device异常', error)
      res.send({status: 1, msg: '添加device异常, 请重新尝试'})
    })
}





// 更新设备
/**
 * 添加一个 device
 * @route POST /manage/device/update
 * @group deviceobj - Operations about device
 * @consumes application/x-www-form-urlencoded
 * @param {string} device_number.formData.required
 * @returns {object} 200 - An array of device info
 * @returns {Error}  default - Unexpected error
 */
// router.post('/manage/lpar/update', (req, res) => {
exports.deviceupdate = function(req, res){
  const device = req.body
  // 此种写法也可以
  // LparModel.findOneAndUpdate({lpar_id: lpar.lpar_id}, Object.assign({}, lpar)) 
  DeviceModel.findOneAndUpdate({device_number: device.device_number}, device)
    .then(oldDevice => {
      const data = Object.assign(oldDevice, device)
      // 返回
      res.send({status: 0, data})
    })
    .catch(error => {
      console.error('更新lpar异常', error)
      res.send({status: 1, msg: '更新lpar异常, 请重新尝试'})
    })
}



// 删除设备
/**
 * 添加一个 device
 * @route POST /manage/device/delete
 * @group deviceobj - Operations about device
 * @consumes application/x-www-form-urlencoded
 * @param {string} device_number.formData.required
 * @returns {object} 200 - An array of device info
 * @returns {Error}  default - Unexpected error
 */
// router.post('/manage/lpar/delete', (req, res) => {
exports.devicedelete = function(req, res){
  const {device_number} = req.body
  DeviceModel.deleteOne({device_number: device_number})
    .then((doc) => {
      if(doc.n >= 1)
      {
        res.send({status: 0,msg: '删除成功',result: doc, device_number:device_number})
      }
      if(doc.n == 0)
      {
        res.send({status: 0,msg: '未找到需要删除的数据',result: doc, device_number:device_number})
      }
      
    })
    .catch(error => {
      console.error('删除lpar异常', error)
      res.send({status: 1, msg: '删除lpar异常, 请重新尝试'})
    })
}



//查询设备列表

