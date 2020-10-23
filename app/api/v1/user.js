const Router = require('koa-router')
const {RegisterValidater} = require('../../validators/validator')
const { User } = require('../../models/user')
const router = new Router({
  prefix: '/v1/user'//设置路由的基地址 
})

//用户注册路由   
//拼接后的路由地址为：/v1/user/register
router.post('/register', async (ctx) => {
  //1 参数校验
  const v = await new RegisterValidater().validate(ctx)
  //2 获取并整理参数
  const user = {
    nickname : v.get('body.nickname'),
    password : v.get('body.password2'),
    email : v.get('body.email')
  }
  //3 用sequelize实例化的模型将数据插入数据库
  await User.create(user)
  //4 返回前端操作成功
  throw new global.errs.Success() 
})

module.exports = router