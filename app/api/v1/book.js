const Router = require('koa-router')
const {
  parseInt
} = require('lodash')
const {
  PositiveIntegerValidator,
  AddCommentValidator
} = require('../../validators/validator')
const {
  Book
} = require('../../models/book')
const {
  Comment
} = require('../../models/book-comment')
const {
  HotBook
} = require('../../models/hot-book')
const {
  Auth
} = require('../../../middlewares/auth')
const {
  Favor
} = require('../../models/favor')
const { Art } = require('../../models/art')
const router = new Router({
  prefix: '/v1/book' //设置路由的基地址 
})

//获取书籍详细信息
router.get('/:id/detail', new Auth().m, async (ctx) => {
  //1 参数校验
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = parseInt(v.get('path.id'))
  //2 获取书籍详情
  const book = await Book.getDetail(id)
  //3 返回前端
  ctx.body = book
})

//获取热门书籍
router.get('/hot_list', new Auth().m, async (ctx) => {
  //获取热门书籍列表
  const uid = ctx.auth.uid
  const hotBooks = await HotBook.getHotBooks(uid)
  //返回前端
  ctx.body = hotBooks
})

//获取我喜欢的书籍的数量
router.get('/favor/count', new Auth().m, async (ctx) => {
  const uid = ctx.auth.uid
  const count = await Book.getBooksCount(uid)
  //返回前端
  ctx.body = {
    count
  }
})

//获取书籍点赞情况
router.get('/:book_id/favor', new Auth().m, async (ctx) => {
  const uid = ctx.auth.uid
  //参数校验
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'book_id'
  })
  const bookId = v.get('path.book_id')
  //获取该书籍点赞数
  const fav_nums = await Book.getBookFavorCount(bookId)
  //获取用户点赞状态
  const like_status = await Favor.userLikeIt(bookId, 400, uid)
  //返回前端
  ctx.body = {
    fav_nums,
    like_status,
    id: bookId,
  }
})

//给书籍添加短评
router.post('/add/short_comment', new Auth().m, async (ctx) => {
  //参数校验
  const v = await new AddCommentValidator().validate(ctx, {
    id: 'book_id'
  })
  const bookId = v.get('body.book_id')
  const content = v.get('body.content')
  await Comment.addComment(bookId, content)
  throw new global.errs.Success()
})

//获取短评
router.get('/:book_id/short_comment', new Auth().m, async (ctx) => {
  //参数校验
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'book_id'
  })
  const bookId = v.get('path.book_id')
  //查询
  const comments = await Comment.getComments(bookId)
  //返回前端
  ctx.body = {
    comments,
    book_id: bookId
  }
})

//获取热搜关键词
router.get('/hot_keyword', new Auth().m , async (ctx) => {
  ctx.body = {
    hot :[
            "Fluent Python",
            "Python",
            "小程序Java核心编程",
            "慕课网7七月",
            "微信小程序开发入门与实践",
            "C++"
    ]
  }
})



//书籍搜索
router.get('/search', new Auth().m , async (ctx) => {
  const res = {
    "books": [
            {
                    "author": [
                            "Luciano Ramalho"
                    ],
                    "id": 195,
                    "image": "https://img3.doubanio.com/lpic/s27935775.jpg",
                    "isbn": "9781491946008",
                    "price": "USD 39.99",
                    "title": "Fluent Python"
            },
            {
                    "author": [
                            "【英】大卫•加里夫",
                            "David Gariff"
                    ],
                    "id": 44307,
                    "image": "https://img3.doubanio.com/lpic/s27145681.jpg",
                    "isbn": "9787511719164",
                    "price": "98.00元",
                    "title": "艺术谱系"
            }
    ],
    "count": 2,
    "start": 0,
    "total": 2
  }
  ctx.body = res
})


module.exports = router