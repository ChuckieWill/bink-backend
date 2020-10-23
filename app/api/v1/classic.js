const Router = require('koa-router')
// const {HttpException} = require('../../../core/http-exception')
const router = new Router()
const {PositiveIntegerValidator} = require('../../validators/validator')

// 注册中间件
router.post('/v1/:id/classic/latest', async (ctx, next) => {
  const path = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.header
  const body = ctx.request.body
  const v = await new PositiveIntegerValidator().validate(ctx)
  // if(true){
  //   // const error = new HttpException()
  //   const error = new global.errs.HttpException()
  //   throw error
  // }
  ctx.body = 'success'
})

module.exports = router