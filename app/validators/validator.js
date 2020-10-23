//校验器
const {
  LinValidator,
  Rule
} = require('../../core/lin-validator')
//导入数据库操作模型
const { User } = require('../models/user')
//导入登录方式枚举
const {LoginType} = require('../lib/enum')

//正整数校验类
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要是正整数', {
        min: 1
      }),
    ]
  }
}

//用户注册参数校验类
class RegisterValidater extends LinValidator {
  constructor(){
    super()
    //邮箱校验
    this.email = [
      new Rule('isEmail','不符合email规范')
    ],
    //密码1校验
    this.password1 = [
      //密码长度限制
      new Rule('isLength','密码至少6个字符,最多32个字符',{
        min:6,
        max:32
      }),
      //排除特殊字符
      new Rule('matches','密码不符合规范','^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ],
    //密码1校验同密码2
    this.password2 = this.password1
    //昵称校验
    this.nickname = [
      //昵称长度限制
      new Rule('isLength','昵称至少6个字符,最多32个字符',{
        min:6,
        max:32
      }),
    ]
  }

  //自定义校验，用于多个参数一起的校验
  //判断两个密码是否一致，不一致则抛出错误
  validatePassword(vals){
    const psw1 = vals.body.password1
    const psw2 = vals.body.password2
    if(psw1 !== psw2){
      throw new Error('两个密码必须相同')
    }
  }

  //判断用户是否已经存在，若为重复用户则抛出错误
  async validateEmail(vals){
    const email = vals.body.email
    //查找数据库中是否有满足条件的记录---sequelize中的语法
    const user = await User.findOne({
      where:{
        email:email
      }
    })
    //查找到则返回记录  若user有值则表明已存在
    if(user){
      throw new Error('email已存在')
    }
  }
}

//登录token校验类
class TokenValidator extends LinValidator {
  constructor(){
    super()
    //账户校验
    this.account = [
      new Rule('isLength','账户至少4个字符，最多32个字符',{
        min: 4,
        max: 32
      })
    ]
    //密码校验
    this.secret = [
      new Rule('isOptional'),//该参数可选择性传入，若传入则执行下面的校验
      new Rule('isLength','密码最少6个字符,最多128个',{
        min: 6,
        max: 128
      })
    ]
  }
  //登录方式校验
  validateLoginType(vals){
    if(!vals.body.type){
      throw new Error('type参数必须传入')
    }
    if(!LoginType.isTheType(vals.body.type)){
      throw new Error('type参数不合法')
    }
  }
 
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidater,
  TokenValidator
}