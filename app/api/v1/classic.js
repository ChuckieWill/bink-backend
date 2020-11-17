const Router = require('koa-router')
const {Auth} = require('../../../middlewares/auth')
const {Flow} = require('../../models/flow')
const {Art} = require('../../models/art')
const { Favor } = require('../../models/favor')
const {PositiveIntegerValidator,ClassicValidator} = require('../../validators/validator')
const { parseInt } = require('lodash')
const router = new Router({
  prefix: '/v1/classic'//设置路由的基地址 
})

// 注册中间件
router.get('/latest', new Auth().m, async (ctx, next) => {
  //在期刊flow表单中查找最后一期，即index最大的一期
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
  })
  //查询期刊实体信息
  const art = await Art.getData(flow.art_id, flow.type)
  //获取该期刊点赞状态
  const likeLatest = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  art.setDataValue('like_status', likeLatest)
  //将期刊序列号添加到返回对象中
  art.setDataValue('index', flow.index)
  ctx.body = art
})

//获取当前一期的上一期，即index-1的一期
router.get('/:index/previous',new Auth().m, async (ctx) => {
  //1 参数校验
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  //2 数据库查询
  //在期刊flow表单中查找
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index : index - 1
    }
  })
  //没找到这返回未找到资源
  if(!flow){
    throw new global.errs.NotFound('该期内容不存在', 3000)
  }
  //查询期刊实体信息
  const art = await Art.getData(flow.art_id, flow.type)
  //获取该期刊点赞状态
  const likePrevious = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  art.setDataValue('like_status', likePrevious)
  //将期刊序列号添加到返回对象中
  art.setDataValue('index', flow.index)

  //3 查询结果返回前端
  ctx.body = art
})

//获取当前一期的下一期，即index+1的一期
router.get('/:index/next',new Auth().m, async (ctx) => {
  //1 参数校验
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  //2 数据库查询
  //在期刊flow表单中查找
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index : index + 1
    }
  })
  //没找到这返回未找到资源
  if(!flow){
    throw new global.errs.NotFound('该期内容不存在', 3000)
  }
  //查询期刊实体信息
  const art = await Art.getData(flow.art_id, flow.type)
  //获取该期刊点赞状态
  const likePrevious = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  art.setDataValue('like_status', likePrevious)
  //将期刊序列号添加到返回对象中
  art.setDataValue('index', flow.index)

  //3 查询结果返回前端
  ctx.body = art
})

//获取点赞信息
router.get('/:type/:id/favor',new Auth().m, async (ctx) => {
   //1 参数校验
   const v = await new ClassicValidator().validate(ctx)
   //2 数据库查询
   const art_id = v.get('path.id')
   const type = parseInt(v.get('path.type'))
   //2.1 获取期刊点赞数量
   const art = await Art.getData(art_id,type)
   if(!art){
     throw new global.errs.NotFound()
   }
   const fav_nums = art.fav_nums
   //2.2 获取期刊点赞状态
   const like_status = await Favor.userLikeIt(art_id, type ,ctx.auth.uid)
   //3 查询结果返回前端
   ctx.body = {
     fav_nums,
     like_status,
     id : art_id
   }
})

//获取某一期详细信息
router.get('/:type/:id',new Auth().m, async (ctx) => {
  //1 参数校验
  const v = await new ClassicValidator().validate(ctx)
  //2 数据库查询
  const art_id = v.get('path.id')
  const type = parseInt(v.get('path.type'))
  //2.1 获取期刊信息
  const art = await Art.getData(art_id,type)
  if(!art){
    throw new global.errs.NotFound()
  }
  //2.2 获取期刊序列号index
  const flow = await Flow.findOne({
    where: {
      art_id,
      type
    }
  })
  const index = flow.index
  //2.3 查询点赞的状态
  const like_status = await Favor.userLikeIt(art_id, type ,ctx.auth.uid)
  //3 查询结果返回前端
  art.setDataValue('index', index)
  art.setDataValue('like_status', like_status)
  ctx.body = art
})

//获取我喜欢的期刊
router.get('/favor',new Auth().m, async (ctx) => {
  //1 获取用户uid
  const uid = ctx.auth.uid
  //2 获取所有点赞的期刊的类型和id号
  const arts = await Favor.getMyClassicFavors(uid)
  //3 获取所有喜欢的期刊的详情信息
  const result = await Art.getClassicList(arts)
  //4 返回前端
  ctx.body = result
})

module.exports = router