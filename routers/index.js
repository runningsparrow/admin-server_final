/*
用来定义路由的路由器模块
 */
const express = require('express')
const md5 = require('blueimp-md5')



const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')
const ProductModel = require('../models/ProductModel')
const RoleModel = require('../models/RoleModel')

//20210214
const PlexModel = require('../models/PlexModel')
//20210609
const LparModel = require('../models/LparModel')
//20210719
const EnvModel = require('../models/EnvModel')
//20210806
const Devicemodel = require('../models/DeviceModel')


//20210724 在路由里面调用刚才写好的方法生成Token   router.js
const {createToken} = require("../utils/jwt.js");

const user = require('./user')
const plexobj = require('./plex')


// 得到路由器对象
const router = express.Router()
// console.log('router', router)

// 指定需要过滤的属性
const filter = {password: 0, __v: 0}




// 登陆
// router.post('/login', (req, res) => {
//   const {username, password} = req.body
//   // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
//   UserModel.findOne({username, password: md5(password)})
//     .then(user => {
//       if (user) { // 登陆成功
//         // 生成一个cookie(userid: user._id), 并交给浏览器保存
//         res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})

//         //20210724 生成token
//         const  Token =   createToken({username, password});

//         if (user.role_id) {
//           RoleModel.findOne({_id: user.role_id})
//             .then(role => {
//               user._doc.role = role
//               console.log('role user', user)
//               res.send({status: 0, data: user, Token:Token })
//             })
//         } else {
//           user._doc.role = {menus: []}
//           // 返回登陆成功信息(包含user)
//           res.send({status: 0, data: user, Token:Token})
//         }

//       } else {// 登陆失败
//         res.send({status: 1, msg: '用户名或密码不正确!'})
//       }
//     })
//     .catch(error => {
//       console.error('登陆异常', error)
//       res.send({status: 1, msg: '登陆异常, 请重新尝试'})
//     })
// })

router.post('/login', (req, res) =>{
  user.loginpost(req, res) 
})

// /**
//  * 用户登录
//  * @route POST /login
//  * @group user - Operations about user
//  * @param {string} username.query.required - 请输入用户名
//  * @param {string} password.query.required - 请输入密码
//  */
// loginpost = function(req, res)  {
//   const {username, password} = req.body
//   // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
//   UserModel.findOne({username, password: md5(password)})
//     .then(user => {
//       if (user) { // 登陆成功
//         // 生成一个cookie(userid: user._id), 并交给浏览器保存
//         res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})

//         //20210724 生成token
//         const  Token =   createToken({username, password});

//         if (user.role_id) {
//           RoleModel.findOne({_id: user.role_id})
//             .then(role => {
//               user._doc.role = role
//               console.log('role user', user)
//               res.send({status: 0, data: user, Token:Token })
//             })
//         } else {
//           user._doc.role = {menus: []}
//           // 返回登陆成功信息(包含user)
//           res.send({status: 0, data: user, Token:Token})
//         }

//       } else {// 登陆失败
//         res.send({status: 1, msg: '用户名或密码不正确!'})
//       }
//     })
//     .catch(error => {
//       console.error('登陆异常', error)
//       res.send({status: 1, msg: '登陆异常, 请重新尝试'})
//     })
// }

// 添加用户
router.post('/manage/user/add', (req, res) => {
  // 读取请求参数数据
  const {username, password} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  UserModel.findOne({username})
    .then(user => {
      // 如果user有值(已存在)
      if (user) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此用户已存在'})
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        return UserModel.create({...req.body, password: md5(password || '111111')})
      }
    })
    .then(user => {
      // 返回包含user的json数据
      res.send({status: 0, data: user})
    })
    .catch(error => {
      console.error('注册异常', error)
      res.send({status: 1, msg: '添加用户异常, 请重新尝试'})
    })
})


// 更新用户
router.post('/manage/user/update', (req, res) => {
  const user = req.body
  UserModel.findOneAndUpdate({_id: user._id}, user)
    .then(oldUser => {
      const data = Object.assign(oldUser, user)
      // 返回
      res.send({status: 0, data})
    })
    .catch(error => {
      console.error('更新用户异常', error)
      res.send({status: 1, msg: '更新用户异常, 请重新尝试'})
    })
})

// 删除用户
router.post('/manage/user/delete', (req, res) => {
  const {userId} = req.body
  UserModel.deleteOne({_id: userId})
    .then((doc) => {
      res.send({status: 0})
    })
})

// 获取用户信息的路由(根据cookie中的userid)
/*router.get('/user', (req, res) => {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if (!userid) {
    return res.send({status: 1, msg: '请先登陆'})
  }
  // 根据userid查询对应的user
  UserModel.findOne({_id: userid}, filter)
    .then(user => {
      if (user) {
        res.send({status: 0, data: user})
      } else {
        // 通知浏览器删除userid cookie
        res.clearCookie('userid')
        res.send({status: 1, msg: '请先登陆'})
      }
    })
    .catch(error => {
      console.error('获取用户异常', error)
      res.send({status: 1, msg: '获取用户异常, 请重新尝试'})
    })
})*/

// 获取所有用户列表
router.get('/manage/user/list', (req, res) => {
  UserModel.find({username: {'$ne': 'admin'}})
    .then(users => {
      RoleModel.find().then(roles => {
        res.send({status: 0, data: {users, roles}})
      })
    })
    .catch(error => {
      console.error('获取用户列表异常', error)
      res.send({status: 1, msg: '获取用户列表异常, 请重新尝试'})
    })
})


// 添加分类
router.post('/manage/category/add', (req, res) => {
  const {categoryName, parentId} = req.body
  CategoryModel.create({name: categoryName, parentId: parentId || '0'})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('添加分类异常', error)
      res.send({status: 1, msg: '添加分类异常, 请重新尝试'})
    })
})

// 获取分类列表
router.get('/manage/category/list', (req, res) => {
  const parentId = req.query.parentId || '0'
  CategoryModel.find({parentId})
    .then(categorys => {
      res.send({status: 0, data: categorys})
    })
    .catch(error => {
      console.error('获取分类列表异常', error)
      res.send({status: 1, msg: '获取分类列表异常, 请重新尝试'})
    })
})

// 更新分类名称
router.post('/manage/category/update', (req, res) => {
  const {categoryId, categoryName} = req.body
  CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName})
    .then(oldCategory => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('更新分类名称异常', error)
      res.send({status: 1, msg: '更新分类名称异常, 请重新尝试'})
    })
})

// 根据分类ID获取分类
router.get('/manage/category/info', (req, res) => {
  const categoryId = req.query.categoryId
  CategoryModel.findOne({_id: categoryId})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('获取分类信息异常', error)
      res.send({status: 1, msg: '获取分类信息异常, 请重新尝试'})
    })
})


// 添加产品
router.post('/manage/product/add', (req, res) => {
  const product = req.body
  ProductModel.create(product)
    .then(product => {
      res.send({status: 0, data: product})
    })
    .catch(error => {
      console.error('添加产品异常', error)
      res.send({status: 1, msg: '添加产品异常, 请重新尝试'})
    })
})

// 获取产品分页列表
router.get('/manage/product/list', (req, res) => {
  const {pageNum, pageSize} = req.query
  ProductModel.find({})
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('获取商品列表异常', error)
      res.send({status: 1, msg: '获取商品列表异常, 请重新尝试'})
    })
})

// 搜索产品列表
router.get('/manage/product/search', (req, res) => {
  const {pageNum, pageSize, searchName, productName, productDesc} = req.query
  let contition = {}
  if (productName) {
    contition = {name: new RegExp(`^.*${productName}.*$`)}
  } else if (productDesc) {
    contition = {desc: new RegExp(`^.*${productDesc}.*$`)}
  }
  ProductModel.find(contition)
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('搜索商品列表异常', error)
      res.send({status: 1, msg: '搜索商品列表异常, 请重新尝试'})
    })
})

// 更新产品
router.post('/manage/product/update', (req, res) => {
  const product = req.body
  ProductModel.findOneAndUpdate({_id: product._id}, product)
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('更新商品异常', error)
      res.send({status: 1, msg: '更新商品名称异常, 请重新尝试'})
    })
})

// 更新产品状态(上架/下架)
router.post('/manage/product/updateStatus', (req, res) => {
  const {productId, status} = req.body
  ProductModel.findOneAndUpdate({_id: productId}, {status})
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('更新产品状态异常', error)
      res.send({status: 1, msg: '更新产品状态异常, 请重新尝试'})
    })
})


// 添加角色
router.post('/manage/role/add', (req, res) => {
  const {roleName} = req.body
  RoleModel.create({name: roleName})
    .then(role => {
      res.send({status: 0, data: role})
    })
    .catch(error => {
      console.error('添加角色异常', error)
      res.send({status: 1, msg: '添加角色异常, 请重新尝试'})
    })
})

// 获取角色列表
router.get('/manage/role/list', (req, res) => {
  RoleModel.find()
    .then(roles => {
      res.send({status: 0, data: roles})
    })
    .catch(error => {
      console.error('获取角色列表异常', error)
      res.send({status: 1, msg: '获取角色列表异常, 请重新尝试'})
    })
})

// 更新角色(设置权限)
router.post('/manage/role/update', (req, res) => {
  const role = req.body
  role.auth_time = Date.now()
  RoleModel.findOneAndUpdate({_id: role._id}, role)
    .then(oldRole => {
      // console.log('---', oldRole._doc)
      res.send({status: 0, data: {...oldRole._doc, ...role}})
    })
    .catch(error => {
      console.error('更新角色异常', error)
      res.send({status: 1, msg: '更新角色异常, 请重新尝试'})
    })
})





// //20210214
// // 添加plex

router.post('/manage/plex/add', (req, res) =>{
  plexobj.plexadd(req, res) 
})


// router.post('/manage/plex/add', (req, res) => {
//   // 读取请求参数数据
//   const {plexname} = req.body
//   // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
//   // 查询(根据username)
//   PlexModel.findOne({plexname})
//     .then(plex => {
//       // 如果user有值(已存在)
//       if (plex) {
//         // 返回提示错误的信息
//         res.send({status: 1, msg: '此plex已存在'})
//         return new Promise(() => {
//         })
//       } else { // 没值(不存在)
//         // 保存
//         return PlexModel.create({...req.body})
//       }
//     })
//     .then(plex => {
//       // 返回包含user的json数据
//       res.send({status: 0, data: plex})
//     })
//     .catch(error => {
//       console.error('添加plex异常', error)
//       res.send({status: 1, msg: '添加plex异常, 请重新尝试'})
//     })
// })


// 更新plex
router.post('/manage/plex/update', (req, res) => {
  const plex = req.body
  // console.log(lpar.lpar_id)
  // 此种写法也可以
  // LparModel.findOneAndUpdate({lpar_id: lpar.lpar_id}, Object.assign({}, lpar)) 
  PlexModel.findOneAndUpdate({plexname: plex.plexname}, plex)
    .then(oldPlex => {
      console.log("oldPlex: " + oldPlex)
      const data = Object.assign(oldPlex, plex)
      // 返回
      res.send({status: 0, data})
    })
    .catch(error => {
      console.error('更新plex异常', error)
      res.send({status: 1, msg: '更新plex异常, 请重新尝试'})
    })
})


// 删除plex
router.post('/manage/plex/delete', (req, res) => {
  const {plexname} = req.body
  PlexModel.deleteOne({plexname: plexname})
    .then((doc) => {
      if(doc.n >= 1)
      {
        res.send({status: 0,msg: '删除成功',result: doc, plexname:plexname})
      }
      if(doc.n == 0)
      {
        res.send({status: 0,msg: '未找到需要删除的数据',result: doc, plexname:plexname})
      }
      
    })
    .catch(error => {
      console.error('删除lpar异常', error)
      res.send({status: 1, msg: '删除plex异常, 请重新尝试'})
    })
})


// 获取所有plex列表
router.get('/manage/plex/list', (req, res) => {
  PlexModel.find()
    .then(plexes => {
      res.send({status: 0, data: plexes})
    })
    .catch(error => {
      console.error('获取plex列表异常', error)
      res.send({status: 1, msg: '获取plex列表异常, 请重新尝试'})
    })
})


//获取plex关联的 Lpar
router.post('/manage/plex/lpar', (req, res) => {
  const {plexname} = req.body
  console.log(req.body)
  LparModel.find({lpar_sysplex: plexname})
    .then(lpars => {
      res.send({status: 0, data: lpars})
    })
    .catch(error => {
      console.error('获取lpar列表异常', error)
      res.send({status: 1, msg: '获取lpar列表异常, 请重新尝试'})
    })
})




//获取所有Lpar列表
router.get('/manage/lpar/list', (req, res) => {
  LparModel.find()
    .then(lpars => {
      res.send({status: 0, data: lpars})
    })
    .catch(error => {
      console.error('获取lpar列表异常', error)
      res.send({status: 1, msg: '获取lpar列表异常, 请重新尝试'})
    })
})


//添加一个Lpar
router.post('/manage/lpar/add', (req, res) => {
  // 读取请求参数数据
  const {lpar_name} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  LparModel.findOne({lpar_name})
    .then(lpar => {
      // 如果user有值(已存在)
      if (lpar) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此lpar已存在'})
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        return LparModel.create({...req.body})
      }
    })
    .then(lpar => {
      // 返回包含user的json数据
      res.send({status: 0, data: lpar})
    })
    .catch(error => {
      console.error('添加lpar异常', error)
      res.send({status: 1, msg: '添加lpar异常, 请重新尝试'})
    })
})


// 更新lpar
router.post('/manage/lpar/update', (req, res) => {
  const lpar = req.body
  // console.log(lpar.lpar_id)
  // 此种写法也可以
  // LparModel.findOneAndUpdate({lpar_id: lpar.lpar_id}, Object.assign({}, lpar)) 
  LparModel.findOneAndUpdate({lpar_id: lpar.lpar_id}, lpar)
    .then(oldLpar => {
      console.log("oldLpar: " + oldLpar)
      const data = Object.assign(oldLpar, lpar)
      // 返回
      res.send({status: 0, data})
    })
    .catch(error => {
      console.error('更新lpar异常', error)
      res.send({status: 1, msg: '更新lpar异常, 请重新尝试'})
    })
})



// 删除lpar
router.post('/manage/lpar/delete', (req, res) => {
  const {lpar_name} = req.body
  LparModel.deleteOne({lpar_name: lpar_name})
    .then((doc) => {
      if(doc.n >= 1)
      {
        res.send({status: 0,msg: '删除成功',result: doc, lparname:lpar_name})
      }
      if(doc.n == 0)
      {
        res.send({status: 0,msg: '未找到需要删除的数据',result: doc, lparname:lpar_name})
      }
      
    })
    .catch(error => {
      console.error('删除lpar异常', error)
      res.send({status: 1, msg: '删除lpar异常, 请重新尝试'})
    })
})


//Env
//添加一个Env
router.post('/manage/env/add', (req, res) => {
  // 读取请求参数数据
  const {envname} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  EnvModel.findOne({envname})
    .then(env => {
      // 如果user有值(已存在)
      if (env) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此env已存在'})
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        return EnvModel.create({...req.body})
      }
    })
    .then(env => {
      // 返回包含user的json数据
      res.send({status: 0, data: env})
    })
    .catch(error => {
      console.error('添加env异常', error)
      res.send({status: 1, msg: '添加env异常, 请重新尝试'})
    })
})


// 获取所有env列表
router.get('/manage/env/list', (req, res) => {
  EnvModel.find()
    .then(envs => {
      res.send({status: 0, data: envs})
    })
    .catch(error => {
      console.error('获取env列表异常', error)
      res.send({status: 1, msg: '获取plex列表异常, 请重新尝试'})
    })
})


//DeviceModel 增删改查

// 添加设备
router.post('/manage/device/add', (req, res) => {
  // 读取请求参数数据
  const {device_number} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  DeviceMOdel.findOne({device_number})
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
})



//验证token
router.post('/testjwt', (req, res) => {

  

  res.send({status: 0, data: {"result":"token有效"}, pass: true})

  

})


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

require('./file-upload')(router)

module.exports = router