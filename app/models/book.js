const {
  sequelize
} = require('../../core/db') //导入实例化的sequelize
const util = require('util')
const axios = require('axios')
const {
  Sequelize,
  Model
} = require('sequelize') //导入原生类sequelize,模型Model
const { Favor } = require('./favor')

class Book extends Model{
  //获取书籍详细信息(从服务端获取)
  static async getDetail(id){
    //1 获取该书籍的isbn号
    const bookIn = await Book.findOne({
      where: {
        id
      }
    })
    if(!bookIn){
      throw new global.errs.NotFound('数据库中没有该书')
    }
    const isbn = bookIn.isbn
    //2 向第三方接口获取书籍详细信息
    const url = util.format(global.config.book.isbnUrl, isbn)
    let result
    try {
      result = await axios.get(url)
    } catch (error) {
      throw new global.errs.NotFound()
    }
    // const result = await axios.get(url)
    if(!result){
      throw new global.errs.NotFound('未查到此书')
    }
    const book = result.data
    //3 整理数据返回前端
    const bookBack = {
      id,
      title: book.title,
      author: book.abstract.split('/')[0],
      image: book.cover_url,
      summary: book.book_intro,
      pages: "1038",
      price: "149.00元",
      pubdate: "2010-05",
      publisher: "人民邮电出版社",
      binding: "平装"
    }
    return bookBack
  }

  //以uid获取用户喜欢的书籍数量
  static async getBooksCount(uid){
    const count = await Favor.count({
      where: {
        uid,
        type: 400
      }
    })
    return count
  }

  //以book_id获取书籍点赞数量
  static async getBookFavorCount(id){
    const count = await Favor.count({
      where: {
        art_id : id,
        type : 400
      }
    })
    return count
  }


}

Book.init({
  id: { //编号
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement: true //数据库自动的生成自增长的id编号，添加用户时不用传入该属性值
  },
  isbn: {
    type: Sequelize.STRING,
  },
  fav_nums:{
    type:Sequelize.INTEGER,
    defaultValue:0
  }, //点赞数量
},{
  sequelize,
  tableName: 'book'
})

module.exports = {
  Book
}