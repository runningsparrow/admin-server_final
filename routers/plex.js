//20210214
const PlexModel = require('../models/PlexModel')

//20210214
// 添加plex

/**
 * 添加一个 plex
 * @route POST /manage/plex/add
 * @group plexobj - Operations about plex
 * @consumes application/x-www-form-urlencoded
 * @param {string} use.formData.required
 * @param {string} plexname.formData.required
 * @param {number} total.formData.required
 * @param {number} used.formData.required
 * @param {number} free.formData.required
 * @returns {object} 200 - An array of plex info
 * @returns {Error}  default - Unexpected error
 */

// router.post('/manage/plex/add', (req, res) => {
exports.plexadd = function(req, res) {
  // 读取请求参数数据
  const {plexname} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  PlexModel.findOne({plexname})
    .then(plex => {
      // 如果user有值(已存在)
      if (plex) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此plex已存在'})
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        return PlexModel.create({...req.body})
      }
    })
    .then(plex => {
      // 返回包含user的json数据
      res.send({status: 0, data: plex})
    })
    .catch(error => {
      console.error('添加plex异常', error)
      res.send({status: 1, msg: '添加plex异常, 请重新尝试'})
    })
}