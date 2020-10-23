const {HttpException} = require('../core/http-exception')
const {environment} = require('../config/config')

//全局错误处理中间件
const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    //判断是否为自定义已知错误
    const isHttpException = error instanceof HttpException
    //判断是否为开发环境
    const isDev = global.config.environment === 'dev'
    // const isDev = environment === 'dev'
    //判断为开发环境且不是自定义已知错误则抛出异常，便于终端查看错误原因
    if(isDev && !isHttpException){
      throw error
    }
    //判断为已知错误，抛出的错误是封装的http错误类的实例
    if(isHttpException){
      //已知错误的处理
      ctx.body = {
        msg: error.msg,  //错误描述
        error_code: error.errorCode,  //自定义错误码
        request: `${ctx.method} ${ctx.path}`   //发送错误的请求地址
      }
      ctx.status = error.code  //http状态码
    }else{
      //未知错误的处理
      ctx.body = {
        msg: '服务器内部错误 未知错误',
        error_code: 99999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError