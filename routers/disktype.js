//20210806
const DiskTypeModel = require('../models/DiskTypeModel')

//DeviceModel 增删改查


/**
 * 添加一个 disktype
 * @route POST /manage/disktype/add
 * @group disktype 磁盘类型 - Operations about disktype
 * @consumes application/x-www-form-urlencoded
 * @param {string} disk_type.formData.required
 * @param {number} disk_size.formData.required
 * @returns {object} 200 - An array of disktype info
 * @returns {Error}  default - Unexpected error
 */
exports.disktypeadd = function(req, res){
  // 读取请求参数数据
  const {disk_type} = req.body
  console.log(disk_type)
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  DiskTypeModel.findOne({disk_type})
    .then(disktype => {
      // 如果user有值(已存在)
      if (disktype) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此disktype已存在'})
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        console.log(disk_type)
        return DiskTypeModel.create({...req.body})
      }
    })
    .then(disktype => {
      // 返回包含user的json数据
      res.send({status: 0, data: disktype})
    })
    .catch(error => {
      console.error('添加disktype异常', error)
      res.send({status: 1, msg: '添加disktype异常, 请重新尝试'})
    })
}



// 更新设备
/**
 * 更新一个 disktype
 * @route POST /manage/disktype/update
 * @group disktype 磁盘类型 - Operations about disktype
 * @consumes application/x-www-form-urlencoded
 * @param {string} disk_type.formData.required
 * @param {number} disk_size.formData.required
 * @returns {object} 200 - An array of disktype info
 * @returns {Error}  default - Unexpected error
 */
exports.disktypeupdate = function(req, res){
  const disktype = req.body
  // 此种写法也可以
  // LparModel.findOneAndUpdate({lpar_id: lpar.lpar_id}, Object.assign({}, lpar)) 
  DiskTypeModel.findOneAndUpdate({disk_type: disktype.disk_type}, disktype)
    .then(oldDisktype => {
      const data = Object.assign(oldDisktype, disktype)
      // 返回
      res.send({status: 0, data})
    })
    .catch(error => {
      console.error('更新disktype异常', error)
      res.send({status: 1, msg: '更新disktype异常, 请重新尝试'})
    })
}



// 删除设备
/**
 * 删除一个 disktype
 * @route POST /manage/disktype/delete
 * @group disktype 磁盘类型 - Operations about disktype
 * @consumes application/x-www-form-urlencoded
 * @param {string} disk_type.formData.required
 * @returns {object} 200 - An array of disktype info
 * @returns {Error}  default - Unexpected error
 */
exports.disktypedelete = function(req, res){
  const {disk_type} = req.body
  DiskTypeModel.deleteOne({disk_type: disk_type})
    .then((doc) => {
      if(doc.n >= 1)
      {
        res.send({status: 0,msg: '删除成功',result: doc, disk_type:disk_type})
      }
      if(doc.n == 0)
      {
        res.send({status: 0,msg: '未找到需要删除的数据',result: doc, disk_type:disk_type})
      }
      
    })
    .catch(error => {
      console.error('删除disk_type异常', error)
      res.send({status: 1, msg: '删除disk_type异常, 请重新尝试'})
    })
}



//查询设备列表
/**
 * 查询 disktype 列表
 * @route POST /manage/disktype/list
 * @group disktype 磁盘类型 - Operations about disktype
 * @consumes application/x-www-form-urlencoded
 * @returns {object} 200 - An array of disktype info
 * @returns {Error}  default - Unexpected error
 */
// router.get('/manage/device/list', (req, res) => {
exports.disktypelist = function(req, res){
  DiskTypeModel.find()
    .then(disktypes => {
      res.send({status: 0, data: disktypes})
    })
    .catch(error => {
      console.error('获取disktype列表异常', error)
      res.send({status: 1, msg: '获取disktype列表异常, 请重新尝试'})
    })
}


//查询设备by disk_type
/**
 * 通过 disk_type查询一个 disktype
 * @route POST /manage/disktype/querybydisktype
 * @group disktype 磁盘类型 - Operations about disktype
 * @consumes application/x-www-form-urlencoded
 * @param {string} disk_type.formData.required
 * @returns {object} 200 - An array of device info
 * @returns {Error}  default - Unexpected error
 */
// router.post('/manage/device/querybydevice', (req, res) => {
exports.disktypequerybydisktype = function(req, res){
  // 读取请求参数数据
  const {disk_type} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  DiskTypeModel.findOne({disk_type})
    .then(disktype => {
      // 如果user有值(已存在)
      if (disktype) {
        // 返回包含user的json数据
        res.send({status: 0, data: disktype})
      } else { // 没值(不存在)
        res.send({status: 1, msg: '查询disktype异常, 请重新尝试'})
      }
    })
}