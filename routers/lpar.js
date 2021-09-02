const LparModel = require('../models/LparModel')


//查询设备列表
/**
 * 查询 lpar 分页列表
 * @route POST /manage/lpar/pagelist
 * @group lpar 逻辑分区 - Operations about lpar
 * @param {number} pageNum.formData.required
 * @param {number} pageSize.formData.required
 * @consumes application/x-www-form-urlencoded
 * @returns {object} 200 - An array of lpar info
 * @returns {Error}  default - Unexpected error
 */
// 获取产品分页列表
// router.get('/manage/lpar/pagelist', (req, res) => {
exports.lparpagelist = function(req, res){
    //post => req.body 
    //get  => req.query
    const {pageNum, pageSize} = req.body
    LparModel.find({})
      .then(lpars => {
        res.send({status: 0, data: pageFilter(lpars, pageNum, pageSize)})
      })
      .catch(error => {
        console.error('获取lpar列表异常', error)
        res.send({status: 1, msg: '获取lpar列表异常, 请重新尝试'})
      })
}



/*
得到指定数组的分页信息对象
 */
function pageFilter(arr, pageNum, pageSize) {
    pageNum = pageNum * 1
    pageSize = pageSize * 1
    const total = arr.length
    const pages = Math.floor((total + pageSize - 1) / pageSize)
    const start = pageSize * (pageNum - 1)
    const end = start + pageSize <= total ? start + pageSize : total
    const list = []
    for (var i = start; i < end; i++) {
      list.push(arr[i])
    }
  
    return {
      pageNum,
      total,
      pages,
      pageSize,
      list
    }
  }

// 搜索lpar列表
/**
 * 搜索 lpar 页面   
 * @route POST /manage/lpar/search
 * @group lpar 逻辑分区 - Operations about lpar
 * @param {number} pageNum.formData.required
 * @param {number} pageSize.formData.required
 * @param {string} searchName.formData
 * @param {string} lpar_name.formData
 * @param {string} lpar_sysplex.formData
 * @consumes application/x-www-form-urlencoded
 * @returns {object} 200 - An array of lpar info
 * @returns {Error}  default - Unexpected error
 */
// router.get('/manage/lpar/search', (req, res) => {
exports.lparsearch = function(req, res){
  const {pageNum, pageSize, searchName, lpar_name, lpar_sysplex} = req.body
  
  console.log(req.body)
  let contition = {}
  if (lpar_name) {
    contition = {lpar_name: new RegExp(`^.*${lpar_name}.*$`)}
  } else if (lpar_sysplex) {
    contition = {lpar_sysplex: new RegExp(`^.*${lpar_sysplex}.*$`)}
  }
  LparModel.find(contition)
    .then(lpars => {
      
      res.send({status: 0, data: pageFilter(lpars, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('搜索lpar列表异常', error)
      res.send({status: 1, msg: '搜索lpar列表异常, 请重新尝试'})
    })
}
  

