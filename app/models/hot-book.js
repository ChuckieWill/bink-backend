const {
  sequelize
} = require('../../core/db') //导入实例化的sequelize

const {
  Sequelize,
  Model,
  Op
} = require('sequelize') //导入原生类sequelize,模型Model
const { Favor } = require('./favor')

class HotBook extends Model{
  //查询所有热门书籍
  static async getHotBooks(uid){
    //1 获取所有hotbook
    const hotBooks = await HotBook.scope('bh').findAll({
      order: [
        'id'//升序查询
      ]
    })
    const ids = []
    hotBooks.forEach((item) => {
      ids.push(item.id)
    })
    //2 查询给这些书籍点赞的数量
    const favorsNum = await Favor.findAll({
      where: {
        type: 400,
        art_id: {
          [Op.in] : ids
        }
      },
      group:['art_id'], //通过art_id分组
      attributes:['art_id',[Sequelize.fn('COUNT','*'),'count']] //查询出来的字段art_id count  Sequelize.fn('COUNT') 对查询出来的数据求值 SUM求和
    })
    // 返回的favorsNum结构：
    // {
    //   {art_id: 值, count: 值 }  count为含art_id字段记录出现的次数
    // }
    //3 查询当前用户点赞的书籍
    const favorsUser = await Favor.findAll({
      where: {
        uid,
        type: 400,
        art_id: {
          [Op.in] : ids
        }
      }
    })
    
    hotBooks.forEach(book => {
      //1 将fav_nums属性添加到hotbook上
      HotBook._setHotBookFavNums(book, favorsNum)
      //2 将like_status属性添加到hotbook上
      HotBook._setHotBookLike(book, favorsUser)
    })
    return hotBooks
  }
  //将fav_nums属性添加到hotbook上
  static _setHotBookFavNums(book, favors){
    let count = 0
    favors.forEach(item => {
      if(item.art_id === book.art_id){
        count = item.get('count')//*************注意：这里不能用item.count获取****** 
      }
    })
    book.setDataValue('fav_nums', count)
    return book
  }
  //将like_status属性添加到hotbook上
  static _setHotBookLike(book, favors){
    let like = 0
    favors.forEach(item => {
      if(item.art_id === book.art_id){
        like = 1
      }
    })
    book.setDataValue('like_status', like)
    return book
  }
}

HotBook.init({
  id: {//排序
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement: true //数据库自动的生成自增长的id编号，添加用户时不用传入该属性值
  },
  art_id:Sequelize.INTEGER, //书籍在实体book表中的编号
  image:Sequelize.STRING, //图书封面
  author:Sequelize.STRING, //作者
  title:Sequelize.STRING // 标题
},{
  sequelize,
  tableName: 'hot_book'
})

module.exports = {
  HotBook
}