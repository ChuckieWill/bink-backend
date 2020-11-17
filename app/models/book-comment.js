const {
  sequelize
} = require('../../core/db') //导入实例化的sequelize
const {
  Sequelize,
  Model
} = require('sequelize') //导入原生类sequelize,模型Model

class Comment extends Model {
  //添加短评
  static async addComment(bookId, content){
    //查询该短评是否存在
    const comment = await Comment.findOne({
      where: {
        content,
        book_id: bookId
      }
    })
    if(comment){
      //短评存在，则nums+1
      return await comment.increment('nums',{by : 1})
    }else{
      //短评不存在，则添加到数据库
      return await Comment.create({
        content,
        book_id: bookId,
        nums: 1
      })
    }
  }
  //获取书籍短评
  static async getComments(bookId){
    const comments = await Comment.findAll({
      where: {
        book_id:bookId
      }
    })
    comments.forEach((item) => {
      item.exclude = ['id','book_id']
    })
    return comments
  }
}

Comment.init({
  content: Sequelize.STRING(12),//短评最多12个字符
  book_id: Sequelize.INTEGER,
  nums: {//该短评的数量
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
},{
  sequelize,
  tableName: 'comment'
})

module.exports = {
  Comment
}