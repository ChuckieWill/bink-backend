function isTheType(val){
  for(let key in this){
    if(this[key] == val){
      return true
    }
  }
  return false
}

//登录用户类型
const LoginType = {
  USER_MINI_PROGRAM: 100,//小程序方式登录
  USER_EMAIL: 101,//用户邮箱登录
  USER_MOBILE: 102,//用户手机登录
  ADMIN_EMAIL: 200,//管理员邮箱登录
  isTheType
}

//用户权限
const LoginAuth = {
  ADMIN : 9, //管理员和超级管理可访问
  SUPER_ADMIN : 17, //超级管理可访问
}

module.exports = {
  LoginType,
  LoginAuth
}