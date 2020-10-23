const Sequelize = require('sequelize')
const {database} = require('../config/config')//导入数据库配置信息

//参数1：数据库名称  参数2：数据库用户名  参数3：数据库用户密码  参数4：对象（包含多个参数）
const sequelize = new Sequelize(database.dbName, database.user, database.password, {
  host: database.host,//数据库主机名
  port: database.port,//数据库端口号
  dialect: 'mysql' ,/* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */   //数据库类型
  logging: true,//true终端显示数据库操作的sql语句，false则不显示
  timezone: '+08:00',//-----一定为'+08:00'，才能以北京的时间来记录所有的时间------
  define: {
    timestamps:true,//false:建表时不自动生成createAt,updateAt字段;true建表时自动生成，，，
    paranoid: true,//true：自动生成delete_time字段；false：不生成
    createdAt: 'created_at',//重命名自动生成的字段，命名成更符合数据标准的字符形式
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,//将所有的驼峰命名改成下划线命名
  }
});

sequelize.sync({
  force:false //数据库字段更改后自动更新，原理是删除原来的表单（包括数据），再新建表单，开发阶段可使用，上线后不可使用
})

module.exports = {
  sequelize
}