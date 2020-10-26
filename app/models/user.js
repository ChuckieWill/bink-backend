const bcrypt = require('bcrypt')//密码加密库

const {
  sequelize
} = require('../../core/db') //导入实例化的sequelize

const {
  Sequelize,
  Model
} = require('sequelize') //导入原生类sequelize,模型Model

//在数据库中通过user模型新建表单
class User extends Model {
  //邮箱密码登录校验
  static async verifyEmailPassword(email, plainPassword){
    const user = await User.findOne({
      where: {
        email
      }
    })
    if(!user){
      throw new global.errs.AuthFailed('用户名不存在')
    }
    //对比输入密码与数据库中密码是否一致
    const res = bcrypt.compareSync(plainPassword, user.password)
    if(!res){
      throw new global.errs.AuthFailed('密码错误')
    }
    return user
  }

  //微信小程序登录查询数据库
  static async getUserByOpnid(openid){
    const user = await User.findOne({
      where:{
        openid
      }
    })
    return user
  }

  //微信小程序注册写入数据库
  static async registerByOpenid(openid){
    return await User.create({
      openid
    })
  }
}

//定义表单各字段
User.init({
  id: {
    type: Sequelize.INTEGER, //设置属性数据类型为字符串
    primaryKey: true, //设置该属性为主键
    autoIncrement: true //数据库自动的生成自增长的id编号，添加用户时不用传入该属性值
  },
  nickname: Sequelize.STRING, //设置属性数据类型为字符串
  email: {
    type: Sequelize.STRING(128), //设置属性数据类型为字符串，且最多64个字符
    unique: true //设置属性值唯一，不可重复
  },
  password: {
    type: Sequelize.STRING,
    //观察password的变化，每次有变化则调用下面的函数
    //对password进行加密操作
    set(val){
      const salt = bcrypt.genSaltSync(10)//传入数字越大则密码加密越难，成本消耗更大，一般设置为10
      const psw = bcrypt.hashSync(val,salt)
      this.setDataValue('password',psw)
    }
  },
  openid: {
    type: Sequelize.STRING(64), //设置属性数据类型为字符串，且最多64个字符
    unique: true //设置属性值唯一，不可重复
  }
}, {
  sequelize: sequelize,//传入实例化的sequelize,用于建立数据库连接
  tableName:'user'//定义表单的名称
}) 

module.exports = {
  User
}