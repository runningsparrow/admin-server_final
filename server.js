/*
应用的启动模块
1. 通过express启动服务器
2. 通过mongoose连接数据库
  说明: 只有当连接上数据库后才去启动服务器
3. 使用中间件
 */
const mongoose = require('mongoose')
const express = require('express')
const app = express() // 产生应用对象

//20210807 引入 swagger
const expressSwagger = require('express-swagger-generator')(app);
//////////////////////////////////////////////////////////////////////

let options = {
  swaggerDefinition: {
      info: {
          description: 'This is a storage management rest api',
          title: 'Swagger',
          version: '1.0.0',
      },
      host: 'localhost:5000',   //访问 http://localhost:5000/api-docs  //并且此url跳过了jwt的安全验证??
      basePath: '',               //可以改变路径
      consumes: [
        "application/x-www-form-urlencoded",
        // "application/json",
        // "multipart/form-data"
      ],
      produces: [
          "application/json",
          // "application/xml"
          // "application/x-www-form-urlencoded"
      ],
      schemes: ['http', 'https'],
      securityDefinitions: {
          JWT: {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
              description: "",
          }
      },
      security: [{Bearer: []}],
      defaultSecurity: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiJhZG1pbiIsImlhdCI6MTYyODMyMTQ4OCwiZXhwIjoxNjI5MTg1NDg4fQ.m1hSYHsT3OvfHrLwrt_obYk7b_bLSf18_aEpj6OF2Yk'
  },
  basedir: __dirname, //app absolute path
  files: ['./routers/**/*.js'] //Path to the API handle folder //路径千万别写错
};
expressSwagger(options)

//////////////////////////////////////////////////////////////////////

//20210721 日志 =========
var morgan = require('morgan');
// var fs = require('fs');  
const fs = require('fs')

var accessLog = fs.createWriteStream('./access.log', {flags : 'a'});  
var errorLog = fs.createWriteStream('./error.log', {flags : 'a'});  
  
// app.use(morgan('dev'));     //打印到控制台  
app.use(morgan('combined', {stream : accessLog}));      //打印到log日志  

//===========================

//20210724
//项目入口  app.js  调用刚才写好的方法
var  {jwtAuth} = require("./utils/jwt");



// 声明使用静态中间件
app.use(express.static('public'))
// 声明使用解析post请求的中间件
app.use(express.urlencoded({extended: true})) // 请求体参数是: name=tom&pwd=123
app.use(express.json()) // 请求体参数是json结构: {name: tom, pwd: 123}
// 声明使用解析cookie数据的中间件
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//路由拦截判断 token是否上送
// app.use(jwtAuth);


//handle UnauthorizedError
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {	
	  //  这个需要根据自己的业务逻辑来处理 具体的err值 请看下面

    resdata = {status: 1, data: err.inner}
    res.status(401).send(resdata);
  }
});


// 声明使用路由器中间件
const indexRouter = require('./routers')
app.use('/', indexRouter)  //

// const fs = require('fs')

// 必须在路由器中间之后声明使用
/*app.use((req, res) => {
  fs.readFile(__dirname + '/public/index.html', (err, data)=>{
    if(err){
      console.log(err)
      res.send('后台错误')
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
      });
      res.end(data)
    }
  })
})*/

// 通过mongoose连接数据库
// mongoose.connect('mongodb://localhost/server_db2', {useNewUrlParser: true})
//   .then(() => {
//     console.log('连接数据库成功!!!')
//     // 只有当连接上数据库后才去启动服务器
//     app.listen('5000', () => {
//       console.log('服务器启动成功, 请访问: http://localhost:5000')
//     })
//   })
//   .catch(error => {
//     console.error('连接数据库失败', error)
//   })

//138.128.215.73
mongoose.connect('mongodb://138.128.215.73/server_db2', {useNewUrlParser: true})
  .then(() => {
    console.log('连接数据库成功!!!')
    // 只有当连接上数据库后才去启动服务器
    app.listen('5000', () => {
      console.log('服务器启动成功, 请访问: http://localhost:5000')
    })
  })
  .catch(error => {
    console.error('连接数据库失败', error)
  })