const Router = require('koa-router')
const {TokenValidator} = require('../../validators/validator')//登录参数校验
const {LoginType} = require('../../lib/enum')//登录方式枚举
const {User} = require('../../models/user')//用户模型，操作数据库
const {generateToken} = require('../../../core/utils')//生成token令牌
const {Auth} = require('../../../middlewares/auth')//用户不同角色权限校验
const {WXManager} = require('../../services/wx')//微信小程序登录相关业务逻辑
const router = new Router({
  prefix: '/v1/token'//设置路由的基地址 
})

router.post('/', async (ctx) => {
  let token
  //1 参数校验
  const v = await new TokenValidator().validate(ctx)
  //2 根据不同的登录方式进行登录校验
  switch(v.get('body.type')){
    //web邮箱登录
    case LoginType.USER_EMAIL: 
      token = await emailLogin(v.get('body.account'),v.get('body.secret'))
      break;
    //微信小程序登录
    case LoginType.USER_MINI_PROGRAM:
      token = await WXManager.codeToToken(v.get('body.account'))
      break;
    default:
      throw new global.errs.ParameterException('该登录方式暂没有相应的处理处理函数')
  }
  //3 将数据返回前端
  ctx.body = {
    token
  }
})

//web邮箱登录获取token
async function emailLogin(account, password){
  const user = await User.verifyEmailPassword(account, password)
  const token = generateToken(user.id, Auth.USER)
  return token
}

module.exports = router