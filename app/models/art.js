const { parseInt, flatten } = require('lodash')
const {Movie,Music,Sentence} = require('./classic')
const {Op} = require('sequelize') 
class Art {
  //获取多个期刊（传入多个type，每个type又包含多个的期刊）
  static async getClassicList(artInfoList){
    const artInfoObj = {
      100: [],
      200: [],
      300: []
    }
    for(let artInfo of artInfoList){
      artInfoObj[artInfo.type].push(artInfo.art_id)
    }
    const artsArr = []
    for(let key in artInfoObj){
      const ids = artInfoObj[key]
      if(ids.length === 0){
        continue
      }
      const arts = await Art._getListByType(ids,parseInt(key))
      artsArr.push(arts)
    }
    return flatten(artsArr)//将二维数组转化为一维数组
  }

  //获取期刊详情，查询多个（in查询，一次查询多个，传入要查询的id号的列表）
  static async _getListByType(ids, type){
    let arts = []
    const finder = {
      where: {
        id: {
          [Op.in]: ids// in查询，避免循环查询数据库  ids是要查找的数据id数组
        }
      }
    }
    switch(type){
      case 100:
        arts = await Movie.scope('bh').findAll(finder)
        break
      case 200:
        arts = await Music.scope('bh').findAll(finder)
        break
      case 300:
        arts = await Sentence.scope('bh').findAll(finder)
        break
      case 400:
        break
      default:
        break
    }
    return arts
  }

  //获取期刊详情，查询单个
  static async getData(id, type){
    let art = null
    const finder = {
      where: {
        id
      }
    }
    switch(type){
      case 100:
        art = await Movie.scope('bh').findOne(finder)
        break
      case 200:
        art = await Music.scope('bh').findOne(finder)
        break
      case 300:
        art = await Sentence.scope('bh').findOne(finder)
        break
      case 400:
        const {Book} = require('./book')
        art = await Book.findOne(finder)
        break
      default:
        break
    }
    return art
  }
}

module.exports = {
  Art
}