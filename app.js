//项目入口文件
const Koa = require('koa')
const axios = require('axios')
const parser = require('koa-bodyparser')
const catchError = require('./middlewares/exception')
const InitManager = require('./core/init')


const app = new Koa()
//注册全局错误处理中间件
app.use(catchError)
//注册获取body参数中间件
app.use(parser())
//初始化
InitManager.initCore(app)

app.listen(3000)