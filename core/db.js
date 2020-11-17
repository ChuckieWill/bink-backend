const { Model } = require('sequelize')
const Sequelize = require('sequelize')
const {unset, clone, isArray} = require('lodash')
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
    scopes: {//自定义查询语句，
      bh : {//bh为自定义名称
        attributes: {//查询是调用scope('bh')，则可以在查询时排除以下字段，即查询结果不包含一下字段
          exclude : ['updated_at', 'deleted_at', 'created_at']
        }
      }
    }
  }
});

sequelize.sync({
  force:false //数据库字段更改后自动更新，原理是删除原来的表单（包括数据），再新建表单，开发阶段可使用，上线后不可使用
})

//JSON序列化
Model.prototype.toJSON = function(){
  //浅拷贝 this.dataValues可以拿到模型上所有属性
  let data = clone(this.dataValues)
  //lodash-unset,移除对象属性
  unset(data,'updated_at')
  unset(data,'created_at')
  unset(data,'deleted_at')

  // exclude 模型上要删除的字段 提供模型实例自定义需要删除的字段
  //lodash-isArray,判断是否为数组
  if(isArray(this.exclude)){
    //遍历数组
    this.exclude.forEach((value)=>{
      //移除需要自定义需要删除的字段
      unset(data,value)
    })
  }

  return data
}

module.exports = {
  sequelize
}