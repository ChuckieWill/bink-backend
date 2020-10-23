const Router = require('koa-router')
const {TokenValidator} = require('../../validators/validator')
const {LoginType} = require('../../lib/enum')
const {User} = require('../../models/user')
const router = new Router({
  prefix: '/v1/token'//设置路由的基地址 
})

router.post('/', async (ctx) => {
  //1 参数校验
  const v = await new TokenValidator().validate(ctx)
  //2 根据不同的登录方式进行登录校验
  switch(v.get('body.type')){
    case LoginType.USER_EMAIL: 
      await emailLogin(v.get('body.account'),v.get('body.secret'))
      break;
    case LoginType.USER_MINI_PROGRAM:

      break;
    default:
      throw new global.errs.ParameterException('该登录方式暂没有相应的处理处理函数')
  }
})

async function emailLogin(account, password){
  const user = await User.verifyEmailPassword(account, password)
}

module.exports = router