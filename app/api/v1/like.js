const Router = require('koa-router')
const {Auth} = require('../../../middlewares/auth')
const {LikeValidator} = require('../../validators/validator')
const {Favor} = require('../../models/favor')
const router = new Router({
  prefix: '/v1/like'//设置路由的基地址 
})

// 点赞
router.post('/', new Auth().m, async (ctx, next) => {
  //1 参数校验（art_id, type）
  const v = await new LikeValidator().validate(ctx,{
    id: 'art_id' //别名
  })
  //2 更新数据库
  await Favor.like(ctx.auth.uid,v.get('body.type'),v.get('body.art_id'))
  //3 返回前端操作成功
  throw new global.errs.Success()
})

// 取消点赞
router.post('/cancel', new Auth().m, async (ctx, next) => {
  //1 参数校验（art_id, type）
  const v = await new LikeValidator().validate(ctx,{
    id: 'art_id' //别名
  })
  //2 更新数据库
  await Favor.dislike(ctx.auth.uid,v.get('body.type'),v.get('body.art_id'))
  //3 返回前端操作成功
  throw new global.errs.Success()
})

module.exports = router