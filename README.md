#  bink-backend项目说明

##  项目简介

> 关于本项目框架各模块详细讲解，可查看[本人博客-koa学习笔记](https://chuckiewill.github.io/2020/03/02/node/koa/koa/)
>
> 本项目基础框架：**[koa开发基础框架模板Github地址](https://github.com/ChuckieWill/node-server-koa2)**

###  项目核心内容

* 基于第三方库`Lin-validator`可自定义封装参数校验器-validator.js
* 基于第三方库`Sequelize`，可更方便的实现对数据库的操作，并封装了连接MySQL数据库-db.js
* 实现了用户注册、用户登录、token校验等接口
  * 且用户登录方式具有可扩展性，可自定义添加更多登录方式、用户类型（权限）
* 封装了全局异常处理中间件-exception.js
* 封装了用户访问权限校验中间件-auth.js
* 封装了http错误类，且可自定义扩展-http-exceptions.js
* 封装了项目初始化文件-init.js
* 使用`jsonwebtoken`生成token
* 使用`bcryptjs`加密密码

###  目录文件说明

* app

  * api
    * v1  api版本1的路由
      * classic.js   期刊接口
      * book.js     书籍接口
      * like.js         点赞接口
      * test.js        测试接口
      * user.js      用户注册路由（邮箱注册方式）
      * token.js    用户登录（包括小程序、web等多种登录方式，本质是身份验证并返回token）
    * v2  api版本2的路由
  * models
    * user.js  相关用户的操作数据库的数据模型
    * art.js     书刊模型
    * book-comment.js   书籍评论模板
    * book.js   书籍模型
    * classic.js  期刊模型
    * favor.js    点赞模型
    * flow.js      期刊业务模型
    * hot-book.js   热门书籍模型
  * validators
    * validator.js  继承LinValidator类，自定义具体业务的参数校验类
  * lib
    * enum.js 枚举，定义一些常量（用户类型、用户权限）
  * services
    * wx.js   相关微信小程序登录的业务逻辑（app/models/user.js用户模型的上一层）
* middlewares
  * exception.js    全局异常处理中间件
  * auth.js   用户访问权限验证、token令牌验证
* core
  * db.js   建立数据库连接
  * lin-validator.js      封装的LinValidator类
  * utils.js         utils.js 封装生成token的函数
  * http-exception.js   封装的http错误类
  * init.js  项目初始化
* config
  * config.js   配置信息-环境变量的配置   配置信息-数据库基本信息
* app.js        注册全局异常处理中间件
* package.js  依赖配置文件



##  使用手册

###  启动项目

1. 克隆到本地

2. 安装所有第三方库，终端切到根目录下，执行`npm install`,安装`package.js`中的所有依赖

3. 设置配置文件信息：`config/config.js`

4. 终端根目录下启动项目：`node app.js`或`nodemon app.js`

### [接口文档](https://github.com/ChuckieWill/bink-backend/blob/master/API.md)

### 数据库结构

* user
  *  id: 主键，自增长，*自动生成*
  *  nickname: 用户昵称
  *  email: 用户邮箱，登录账户，唯一
  *  password:
  *  openid:  微信小程序用户openid，唯一

* classic
  * id： 主键
  * content：期刊内容
  * fav_nums: 点赞次数
  * image: 图片
  * pubdate: 发布日期
  * title: 期刊题目
  * type: 期刊类型：100 电影 200 音乐 300 句子
  * url: 音乐播放地址（音乐期刊特有属性）

* flow
  * index: 期号（所有期刊统一排列的序号，包括音乐、电影、句子）
  * art_id: 各类期刊在其实体表中的id号
  * type: 期刊类型,这里的类型分为:100 电影 200 音乐 300 句子

* favor
  * uid: Sequelize.INTEGER,//用户id
  * art_id: Sequelize.INTEGER,//点赞期刊在其表中序列号
  * type: 点赞书刊类型： 100 电影 200 音乐 300 句子  400 书籍

* book

  * id: 主键 ，自动生成
  * isbn: isbn号
  * fav_nums:点赞数量

* hot_book

  * id: 排序，主键，自动生成
  * art_id: 书籍在实体book表中的编号
  * image: 图书封面地址
  * author: 作者
  * title: 标题

