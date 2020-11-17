//令牌验证
const basicAuth = require('basic-auth')//解析HpptBasicAuth方式传递的令牌
const jwt = require('jsonwebtoken')//令牌处理库
class Auth {
  //实例化类时传入具体API的访问级别（可访问的角色）
  constructor(level){
    this.level = level || 1//设置实例化的api权限要求
    //类变量-scope角色定义
    Auth.USER = 8 //普通用户
    Auth.ADMIN = 16 //管理员
    Auth.SUPER_ADMIN = 32 //超级管理员
  }
  //属性
  get m(){
    return async (ctx, next) => {
      //获取前端传来的token
      const userToken = basicAuth(ctx.req)
      //token不存在则阻止访问
      if(!userToken || !userToken.name){
        throw new global.errs.Forbbiden('未传token')
      }
      try {
        //验证token是否合法
        var decode = jwt.verify(userToken.name, global.config.security.secretKey)
      } catch (error) {
        if(error.name == 'TokenExpiredError'){
          throw new global.errs.Forbbiden('token已过期')
        }
        throw new global.errs.Forbbiden('token不合法')
      }
      //权限判断（用户角色判断），
      if(decode.scope < this.level){
        throw new global.errs.Forbbiden('权限不够')
      }
      //将保存在jwt中的用户id:uid和scop取出
      //并保存在上下文auth中，便于随时使用
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }
      await next()
    }
  }

  //验证token是否有效
  static verifyToken(token){
    try {
      jwt.verify(token, global.config.security.secretKey)
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = {
  Auth
}