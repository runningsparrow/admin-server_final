const md5 = require('blueimp-md5')
const UserModel = require('../models/UserModel')
//20210724 在路由里面调用刚才写好的方法生成Token   router.js
const {createToken} = require("../utils/jwt.js");

//这两个参数从注解中拿走
//  * @param {string} username.query.required - 请输入用户名
//  * @param {string} password.query.required - 请输入密码
//* @produces application/x-www-form-urlencoded
/**
 * 用户登录
 * @route POST /login
 * @group user 用户 - Operations about user
 * @consumes application/x-www-form-urlencoded
 * @param {string} username.formData.required
 * @param {string} password.formData.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
 exports.loginpost = function(req, res)  {
    console.log(res.body)
    const {username, password} = req.body
    // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
    UserModel.findOne({username, password: md5(password)})
      .then(user => {
        if (user) { // 登陆成功
          // 生成一个cookie(userid: user._id), 并交给浏览器保存
          res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
  
          //20210724 生成token
          const  Token =   createToken({username, password});
  
          if (user.role_id) {
            RoleModel.findOne({_id: user.role_id})
              .then(role => {
                user._doc.role = role
                console.log('role user', user)
                res.send({status: 0, data: user, Token:Token })
              })
          } else {
            user._doc.role = {menus: []}
            // 返回登陆成功信息(包含user)
            res.send({status: 0, data: user, Token:Token})
          }
  
        } else {// 登陆失败
          res.send({status: 1, msg: '用户名或密码不正确!'})
        }
      })
      .catch(error => {
        console.error('登陆异常', error)
        res.send({status: 1, msg: '登陆异常, 请重新尝试'})
      })
  }

