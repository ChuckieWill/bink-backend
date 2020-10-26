//统一封装的http错误类
class HttpException extends Error{
  constructor(errorCode=10000,code=400, msg='服务器异常'){
    super()
    this.errorCode = errorCode //项目自定义错误码
    this.code = code //http状态码
    this.msg = msg   //错误描述
  }
}

//参数错误类，一般在参数校验错误时使用
class ParameterException extends HttpException{
  constructor(msg, errorCode){
    super()
    this.code = 400
    this.msg = msg || '参数错误'
    this.errorCode = errorCode || 10000
  }
}

//操作成功类，当操作成功是返回给前端成功提示
class Success extends HttpException{
  constructor(msg, errorCode){
    super()
    this.code = 201 //操作成功状态码
    this.msg = msg || 'ok',
    this.errorCode = errorCode || 0
  }
}

//资源未找到错误类，当用户名没有查找到时等
class NotFound extends HttpException{
  constructor(msg, errorCode){
    super()
    this.code = 404 //资源未找到状态码
    this.msg = msg || '资源未找到',
    this.errorCode = errorCode || 10000
  }
}

//授权失败错误类，密码错误等
class AuthFailed extends HttpException{
  constructor(msg, errorCode){
    super()
    this.code = 401 //资源未找到状态码
    this.msg = msg || '授权失败',
    this.errorCode = errorCode || 10004
  }
}

//禁止访问类  例如令牌验证失败
class Forbbiden extends HttpException{
  constructor(msg, errorCode){
    super()
    this.code = 403 //禁止访问
    this.msg = msg || '禁止访问',
    this.errorCode = errorCode || 10006
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  AuthFailed,
  Forbbiden
}