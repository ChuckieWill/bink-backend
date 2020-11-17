const {
  sequelize
} = require('../../core/db') //导入实例化的sequelize

const {
  Sequelize,
  Model,
  Op
} = require('sequelize') //导入原生类sequelize,模型Model
const { Art } = require('./art')

class Favor extends Model{
  //点赞操作
  static async like(uid, type, art_id){
    //查看数据库是否已存在，若已存在则不再执行添加数据操作
    const favor = await Favor.findOne({
      where:{
        uid,
        type,
        art_id
      }
    })
    if(favor){
      throw new global.errs.LikeError('你已经点过赞了',2000)
    }
    //将点赞写入favor表单，并将相应期刊表单中点赞数量+1
    //此处用到事务，确保数据的一致性（两个操作保持一致，要么都操作，要么都没有操作）
    return sequelize.transaction(async t => {
      //将点赞写入favor表单
      await Favor.create({
        uid,
        art_id,
        type
      },{transaction: t})
      //将相应期刊表单中点赞数量+1
      const art = await Art.getData(art_id, type)
      await art.increment('fav_nums',{by:1, transaction: t})
    })
  }

  //取消点赞操作
  static async dislike(uid, type, art_id){
    //查看数据库是否已存在，若不存在则不再执数据删除操作
    const favor = await Favor.findOne({
      where:{
        uid,
        type,
        art_id
      }
    })
    if(!favor){
      throw new global.errs.DislikeError('你还没点过赞', 2001)
    }
    //删除favor表单的点赞记录，并将相应期刊表单中点赞数量-1
    //此处用到事务，确保数据的一致性（两个操作保持一致，要么都操作，要么都没有操作）
   return sequelize.transaction(async t => {
      //删除favor表单的点赞记录
      await favor.destroy({
        force: true,//false为物理删除，true为软删除
        transaction: t
      })
      //将相应期刊表单中点赞数量-1
      const art = await Art.getData(art_id, type)
      await art.decrement('fav_nums',{by:1, transaction: t})
    })
  }

  //查询用户对当前期刊的点赞状态
  static async userLikeIt (art_id, type, uid){
    const favor = await Favor.findOne({
      where: {
        art_id,
        type,
        uid
      }
    })
    return favor ? 1 : 0
  }

  //查询某个用户喜欢的所有期刊（不包括book）
  static async getMyClassicFavors(uid){
    const arts = await Favor.findAll({
      where: {
        uid,
        type: {
          [Op.not]: 400//不包括book
        }
      }
    })
    if(arts.length === 0){
      throw new global.errs.NotFound()
    }
    return arts
  }

  //查询用户喜欢的书籍的数量
  static async getFavorBooks(){
    
  }
}

Favor.init({
  uid: Sequelize.INTEGER,//用户id
  art_id: Sequelize.INTEGER,//点赞期刊在其表中序列号
  type: Sequelize.INTEGER,//点赞期刊类型
},{
  sequelize,
  tableName: 'favor'
})

module.exports = {
  Favor
}