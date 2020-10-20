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

module.exports = {HttpException,ParameterException}