const axios = require('axios')
const util = require('util')
const {User} = require('../models/user')
const {generateToken} = require('../../core/utils')
const {Auth} = require('../../middlewares/auth')

class WXManager {
  static async codeToToken(code){
    //拼接微信登录验证请求地址
    const url = util.format(global.config.wx.loginUrl,
      global.config.wx.appId,
      global.config.wx.appSecret,
      code)
    //发送请求
    const res = await axios.get(url)
    //判断请求结果是否获取到了openid
    if(res.status !== 200){
      throw new global.errs.AuthFailed('openid获取失败')
    }
    const errCode = res.data.errcode
    const errMsg = res.data.errmsg
    if(errCode){
      throw new global.errs.AuthFailed('openid获取失败:'+errMsg )
    }

    let user = await User.getUserByOpnid(res.data.openid)
    //如果数据库中没有该用户则写入数据
    if(!user){
      user = await User.registerByOpenid(res.data.openid)
    }
    //生成token
    return generateToken(user.id, Auth.USER)
  }
}

module.exports = {
  WXManager
}