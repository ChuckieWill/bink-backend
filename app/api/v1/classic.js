const Router = require('koa-router')
// const {HttpException} = require('../../../core/http-exception')
const {PositiveIntegerValidator} = require('../../validators/validator')
const {Auth} = require('../../../middlewares/auth')
const {LoginAuth} = require('../../lib/enum')
const router = new Router({
  prefix: '/v1/classic'//设置路由的基地址 
})

// 注册中间件
router.get('/latest', new Auth().m, async (ctx, next) => {
  // const path = ctx.params
  // const query = ctx.request.query
  // const headers = ctx.request.header
  // const body = ctx.request.body
  // const v = await new PositiveIntegerValidator().validate(ctx)
  // // if(true){
  // //   // const error = new HttpException()
  // //   const error = new global.errs.HttpException()
  // //   throw error
  // // }
  // ctx.body = 'success'
})

module.exports = router