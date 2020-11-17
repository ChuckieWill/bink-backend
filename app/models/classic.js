const {
  sequelize
} = require('../../core/db') //导入实例化的sequelize

const {
  Sequelize,
  Model
} = require('sequelize') //导入原生类sequelize,模型Model


//定义音乐、句子、电影共有属性
const classicFields = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, 
  },//期刊id
  image: Sequelize.STRING,//图片地址
  content: Sequelize.STRING,//内容描述
  pubdate: Sequelize.DATEONLY,//上传时间
  fav_nums:{
    type:Sequelize.INTEGER,
    defaultValue:0
  }, //喜欢的数量
  title: Sequelize.STRING,//标题
  type: Sequelize.INTEGER//类型 100 电影 200 音乐 300 句子
}

//电影
class Movie extends Model {

}
//数据库中创建表单
Movie.init(classicFields,{
  sequelize,
  tableName: 'movie'
})

//句子
class Sentence extends Model {

}
Sentence.init(classicFields,{
  sequelize,
  tableName: 'sentence'
})

//音乐
class Music extends Model {

}
//添加音乐特有的属性(音乐播放地址url)
const musicFields = Object.assign({url:Sequelize.STRING},classicFields)
Music.init(musicFields,{
  sequelize,
  tableName: 'music'
})

module.exports = {
  Movie,
  Sentence,
  Music
}