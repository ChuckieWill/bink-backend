const requireDirectory = require('require-directory')
const Router = require('koa-router')

//项目初始化
class InitManager {
  //入口方法
  static initCore(app){
    InitManager.app = app
    InitManager.initLoadRouters()
    InitManager.loadHttpException()
    InitManager.loadConfig()
  }

  //将所有路由添加为中间件
  static initLoadRouters(){
    const apiPath = `${process.cwd()}/app/api`  //获取路由路径
    requireDirectory(module, apiPath, {
      visit: whenLoadModule
    })
    //obj为拿到的每个模块
    function whenLoadModule(obj) {
      if(obj instanceof Router){
        InitManager.app.use(obj.routes())//将路由转成中间件并挂到app上
      }
    }  
  }

  //将所有http错误类添加为全局变量，减少使用时的频繁引入
  static loadHttpException(){
    const errors = require('./http-exception') //导入所有http错误类
    global.errs = errors  //添加到全局变量上
  }

  //将配置文件加载到global变量上
  static loadConfig(path=''){
    const configPath = path || process.cwd() + '/config/config'
    const config = require(configPath)
    global.config = config
  }

}

module.exports = InitManager