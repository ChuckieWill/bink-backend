const Router = require('koa-router')
const axios = require('axios')
const util = require('util')
const {
  sequelize
} = require('../../../core/db') //导入实例化的sequelize
const {
  Flow
} = require('../../models/flow')
const {Book} = require('../../models/book')
const {HotBook} = require('../../models/hot-book')
const {
  Movie,
  Sentence,
  Music
} = require('../../models/classic')
const router = new Router({
  prefix: '/v1/test' //设置路由的基地址 
})

//测试第三方接口
router.get('/yushu', async (ctx)=> {
  const result = await axios.get('http://api.xiaomafeixiang.com/api/bookinfo?isbn=9787544270878')
  console.log(result)
  ctx.body = result
})


//将书籍添加到book和hot_book列表中
router.get('/hotbook/add', async (ctx) => {
  const body = ctx.request.body
  const isbn = body.isbn
  //1 向第三方接口获取书籍详细信息
  const url = util.format(global.config.book.isbnUrl, isbn)
  const result = await axios.get(url)
  const book = result.data
  //此处用到事务，确保数据的一致性（两个操作保持一致，要么都操作，要么都没有操作）
  //确保同时写入book和hotbook表
  await sequelize.transaction(async t => {
    //1.1 写入book表单
    const bookIn = await Book.findOne({
      where: {
        isbn: book.isbn
      }
    })
    let isAddBook = null
    if(!bookIn){
      isAddBook = await Book.create({
        isbn: book.isbn
      },{transaction: t})
    }
    //1.2 写入hot_book表单---开发阶段使用---
    const hotBook = await HotBook.findOne({
      where: {
        art_id: isAddBook.id || bookIn.id
      }
    })
    if(!hotBook){
      await HotBook.create({
        art_id: isAddBook.id, //isbn
        image: book.cover_url, //图书封面
        author: book.abstract.split('/')[0], //作者
        title: book.title // 标题
      },{transaction: t})
    }else{
      throw new global.errs.Success('该书籍在hot_book中已添加过')
    }
  })

  throw new global.errs.Success('添加成功')
})

//在book表中添加数据
router.get('/book/add', async (ctx) => {
  const body = ctx.request.body
  const isbn = body.isbn
  //1 向第三方接口获取书籍详细信息
  const url = util.format(global.config.book.isbnUrl, isbn)
  const result = await axios.get(url)
  const book = result.data
  //2 写入book表单
  const bookIn = await Book.findOne({
    where: {
      isbn: book.isbn
    }
  })
  if(!bookIn){
    await Book.create({
      isbn: book.isbn
    })
  }else{
    throw new global.errs.Success('该书籍在hot_book中已添加过')
  }
  throw new global.errs.Success('添加成功')
})

//将最新一期添加到数据库中，并获取当前期刊index值
router.get('/classic/add', async (ctx) => {
  //获取最新期刊
  const body = ctx.request.body
  const index = body.index
  let result
  if (index === -1) {
    result = await axios.get(' http://bl.talelin.com/v1/classic/latest', {
      headers: {
        'appkey': ''
      }
    })
  } else {
    const url = `http://bl.talelin.com/v1/classic/${index}/previous`
    result = await axios.get(url, {
      headers: {
        'appkey': 'K57S1kGd4CLBz2dw'
      }
    })
  }
  console.log(result.data)
  const res = result.data
  //整理存入flow表单的数据
  const flow = {
    index: res.index,
    art_id: res.id,
    type: res.type
  }
  const flowRes = await addFlow(flow, res.index) //写入flow表单

  let addClassic
  //整理存入calssic表单的数据
  const classic = {
    id: res.id,
    image: res.image,
    content: res.content,
    pubdate: res.pubdate,
    fav_nums: res.fav_nums,
    title: res.title,
    type: res.type
  }

  switch (res.type) {
    case 100:
      addClassic = await addMovie(classic, res.id)
      break;
    case 200:
      const music = Object.assign({
        url: res.url
      }, classic)
      addClassic = await addMusic(music, res.id)
      break;
    case 300:
      addClassic = await addSentence(classic, res.id)
      break;
    default:
      break;
  }
  ctx.body = {
    flow: flowRes,
    classic: addClassic
  }
})

async function addFlow(flow, index) {
  const resF = await Flow.findOne({
    where: {
      index
    }
  })
  if (!resF) {
    flow = await Flow.create(flow) //写入flow表单
    return flow
  }
  return null
}

async function addMusic(music, id) {
  const musicRes = await Music.findOne({
    where: {
      id
    }
  })
  if (!musicRes) {
    music = await Music.create(music) //写入music表单
    return music
  }
  return null
}

async function addMovie(movie, id) {
  const movieRes = await Movie.findOne({
    where: {
      id
    }
  })
  if (!movieRes) {
    movie = await Movie.create(movie) //写入movie表单
    return movie
  }
  return null
}

async function addSentence(sentence, id) {
  const resS = await Sentence.findOne({
    where: {
      id
    }
  })
  if (!resS) {
    sentence = await Sentence.create(sentence) //写入sentence表单
    return sentence
  }
  return null
}

module.exports = router
