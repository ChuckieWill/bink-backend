const {
  sequelize
} = require('../../core/db') //导入实例化的sequelize

const {
  Sequelize,
  Model
} = require('sequelize') //导入原生类sequelize,模型Model


//期刊业务表单
class Flow extends Model {

}

Flow.init({
  index: Sequelize.INTEGER,//期号（所有期刊统一排列的序号，包括音乐、电影、句子）
  art_id: Sequelize.INTEGER,//各类期刊在其实体表中的id号
  type: Sequelize.INTEGER// 期刊类型,这里的类型分为:100 电影 200 音乐 300 句子 
},{
  sequelize,
  tableName: 'flow'
})

module.exports = {
  Flow
}