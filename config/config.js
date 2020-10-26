//配置文件  开发环境与生产环境

module.exports = {
  //配置开发环境
  environment : 'dev',   //prod生产环境、dev是开发环境
  //数据库配置信息
  database : {
    dbName:'blink-backend',//数据库名称
    user: 'root',//数据库用户名
    password: '123456',//数据库用户密码
    host: 'localhost',//数据库主机名 
    port:3306,//数据库端口
  },
  //令牌配置信息
  security:{
    secretKey:"abcdefg",//需要特别长且无规律，一旦拿到该密码，则可以破解jsonwebtoken的所有令牌
    expiresIn:60*60*24*30,//令牌过期时间，单位：秒
  },
  //wx登录验证配置信息
  wx:{
    appId: '',//小程序 appId
    appSecret: '',//小程序 appSecret
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
  }
}