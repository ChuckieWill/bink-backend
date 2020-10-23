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

  }
}