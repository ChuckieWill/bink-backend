#  接口文档

##  基地址

```js
http://localhost:3000/v1
```

##  测试接口

> 没有管理端的情况下，自行往数据库中添加数据

####  添加期刊

> 使用该接口之前需要在源码(源码位置：/app/api/v1/test.js)中配置请求第三方接口的`appkey`

**URL:**

```js
GET    /test/classic/add
```

**Parameters**:

* index : 期刊的序列号

####  添加书籍

> 将书籍信息添加到book表中

**URL:**

```js
GET    /test/book/add
```

**Parameters**:

* isbn : 书籍isbn号

#### 添加热门书籍

> 将书籍信息添加到hot_book列表中，此接口同时将书籍添加到了book和hot_book列表中

**URL:**

```js
GET    /test/hotbook/add
```

**Parameters**:

* isbn : 书籍isbn号



##  用户

#### 注册

> 这个注册接口只针对邮箱注册的方式

**URL:**

```js
POST  /user/register
```

**Parameters**:

* nickname :用户昵称
* password : 用户密码
* email :用户邮箱，唯一标识，不可重复

**Response Status** 201:

```js
{
        "error_code": 0,
        "msg": "ok",
        "request": "POST  /like/add"
}
```



####  登录

> **用户邮箱登录：**（需要先调用上面的注册接口注册）
>
> * account: 账户即为邮箱
> * secret: 用户密码
>
> **小程序登录：**（不需要注册，直接在小程序端发来js_code即可）
>
> * account: 账户即为js_code
> * secret: 不用传

**URL:**

```js
POST  /token/
```

**Parameters**:

* account: 账户  
* secret: 密码
* type： 登录方式
  * 100,//小程序方式登录
  * 101,//用户邮箱登录
  * 102,//用户手机登录
  * 200,//管理员邮箱登录



####  token校验

> 校验token合法性，只有合法才返回true，否则返回false

**URL:**

```js
POST  /token/verify
```

**Parameters**:

* token





##  期刊

####  获取最新一期

**URL**:

```
GET      /classic/latest
```

**Response** 200:

```
{
        "content": "人生不能像做菜，把所有的料准备好才下锅",
        "fav_nums": 0,
        "id": 1,
        "image": "http://127.0.0.1:5000/images/movie.7.png",
        "index": 7,
        "like_status": 0,
        "pubdate": "2018-06-22",
        "title": "李安<<饮食男女>>",
        "type": 100
}
```

**Response_description**:

- content：期刊内容
- fav_nums: 点赞次数
- image: 图片
- index: 期号
- like_status: 是否点赞
- pubdate: 发布日期
- title: 期刊题目
- type: 期刊类型,这里的类型分为:100 电影 200 音乐 300 句子
- id: 期刊在数据中序号，供点赞使用

返回期刊的详细信息



#### 获取当前一期的下一期

**URL**:

```
GET      /classic/<int:index>/next
```

**Parameters**:

- index：期号,必填,必须是正整数

**Response** 200:

```
{
        "content": "这个夏天又是一个毕业季",
        "fav_nums": 0,
        "id": 2,
        "image": "http://bl.yushu.im/images/sentence.2.png",
        "index": 2,
        "like_status": 0,
        "pubdate": "2018-06-22",
        "title": "未名",
        "type": 300
}
```

####  获取某一期详细信息

**URL**:

```
GET      /classic/<int:type>/<int:id>
```

**Parameters**:

- id：id号,必填,必须是正整数
- type: 类型号，必填，为100,200,300的一种，分别表示电影，音乐，句子

**Response** 200:

```
{
        "content": "这个夏天又是一个毕业季",
        "fav_nums": 0,
        "id": 2,
        "image": "http://bl.yushu.im/images/sentence.2.png",
        "index": 2,
        "like_status": 0,
        "pubdate": "2018-06-22",
        "title": "未名",
        "type": 300
}
```

####  获取当前一期的上一期

**URL**:

```
GET     /classic/<int:index>/previous
```

**Parameters**:

- index: 期号,必填,必须是正整数

**Response** 200

```
{
        "content": "你陪我步入蝉夏 越过城市喧嚣",
        "fav_nums": 0,
        "image": "http://bl.yushu.im/images/music.1.png",
        "id": 3,
        "index": 1,
        "like_status": 0,
        "pubdate": "2018-06-22",
        "title": "纸短情长",
        "type": 200,
        "url": "http://music.163.com/song/media/outer/url?id=557581284.mp3"
}
```

####  获取点赞信息

**URL**:

```
GET     classic/<int:type>/<int:id>/favor
```

**Parameters**:

- type: 必填, 点赞类型
- id: 必填, 点赞对象的id号

**Response** 200

```
{
        "fav_nums": 1,
        "id": 1,
        "like_status": 1
}
```

####  获取我喜欢的期刊

**URL**:

```
GET    /classic/favor
```

**Response** 200

```
[
            {
                    "content": "人生不能像做菜，把所有的料准备好才下锅",
                    "fav_nums": 1,
                    "id": 1,
                    "image": "http://bl.yushu.im/images/movie.7.png",
                    "pubdate": "2018-06-22",
                    "title": "李安<<饮食男女>>",
                    "type": 100
            }
            {
                    "content": "你陪我步入蝉夏 越过城市喧嚣",
                    "fav_nums": 0,
                    "id": 3,
                    "image": "http://bl.yushu.im/images/music.1.png",
                    "index": 1,
                    "like_status": 0,
                    "pubdate": "2018-06-22",
                    "title": "纸短情长",
                    "type": 200,
                    "url": "http://music.163.com/song/media/outer/url?id=557581284.mp3"
            }
    ]
```

**Response_description**:

返回喜欢期刊的列表



##  点赞

#### 进行点赞

**URL**:

```
POST      /like
```

**Parameters**:

- art_id: 点赞对象,例如你想对电影进行点赞，那这个参数就是电影的id号
- type：点赞类型分为四种：100 电影 200 音乐 300 句子 400 书籍

**Response Status** 201:

```
{
        "error_code": 0,
        "msg": "ok",
        "request": "POST  /like/add"
}
```

#### 取消点赞

**URL**:

```
POST     /like/cancel
```

**Parameters**:

> - art_id: 点赞对象id
> - type：点赞类型

**Response Status** 201:

```
{
        "error_code": 0,
        "msg": "ok",
        "request": "POST  /like/cancel"
}
```



##  书籍

####  获取热门书籍(概要)

**URL**:

```
GET      /book/hot_list
```

**Response** 200:

```
[
        {
                "author": "陈儒",
                "fav_nums": 0,
                "id": 18,
                "image": "https://img3.doubanio.com/lpic/s3435132.jpg",
                "like_status": 0,
                "title": "Python源码剖析"
        },
        {
                "author": "MarkPilgrim",
                "fav_nums": 0,
                "id": 58,
                "image": "https://img3.doubanio.com/lpic/s29631790.jpg",
                "like_status": 0,
                "title": "Dive Into Python"
        },
        {
                "author": "MarkPilgrim",
                "fav_nums": 0,
                "id": 65,
                "image": "https://img3.doubanio.com/lpic/s4059293.jpg",
                "like_status": 0,
                "title": "Dive Into Python 3"
        },
]
```

**response_description**:

- fav_nums:点赞数
- id: 书籍id
- like_status: 是否点赞
- author: 作者
- title: 书籍题目
- image: 书籍图片

返回一个列表，包含所有热门书籍的概要信息

#### 获取书籍短评

**URL**:

```
GET      /book/<int:book_id>/short_comment
```

**Parameters**:

- book_id：书籍的id,必填,必须为正整数

**Response** 200:

```
{
            "comments":
            [
                    {
                            "content": "i hate6!",
                            "nums": 1
                    }
            ],
            "book_id": 1
}
```

**Response_description**:

- comment: 一个评论的列表,包含用户对书籍的评论及对应数量的字典
- book_id: 书籍id

#### 获取喜欢书籍数量

**URL**:

```
GET      /book/favor/count
```

**Response** 200:

```
{
            "count": 10,
}
```

**Response_description**:

- count: 返回我喜欢的书籍数量

####  获取书籍点赞情况

**URL**:

```
GET      /book/<int:book_id>/favor
```

**Parameters**:

- book_id：书籍的id,必填,必须为正整数

**Response** 200:

```
{
            "fav_nums": 0,
            "id": 1,
            "like_status": 0
}
```

####  新增短评

**URL**:

```
POST      /book/add/short_comment
```

**Parameters**:

- book_id：书籍id
- content：评论内容,我们可允许的评论内容范围为12字以内

**Response** 201:

```
{
        "error_code": 0,
        "msg": "ok",
        "request": "POST  /book/add_short_comment"
}
```

#### 获取热搜关键字

**URL**:

```
GET  /book/hot_keyword
```

**Response** 200:

```
{
            "hot":
            [
                    "Fluent Python",
                    "Python",
                    "小程序Java核心编程",
                    "慕课网7七月",
                    "微信小程序开发入门与实践",
                    "C++"
            ]
    }
```

#### 获取书籍详细信息

**URL**:

```
GET  /book/<id>/detail
```

**Parameters**:

- id: 书籍的id号

**Response** 200:

```js
{
    abstract: "[美国] 玛格丽特·米切尔 / 李美华 / 译林出版社 / 2000-9 / 40.00元"
    id: 5
    image: "https://img1.doubanio.com/view/subject/l/public/s1078958.jpg"
    summary: "小说中的故事发生在1861年美国南北战争前夕。生活在南方的少女郝思嘉从小深受南方文化传统的熏陶，可在她的血液里却流淌着野性的叛逆因素。随着战火的蔓廷和生活环境的恶化，郝思嘉的叛逆个性越来越丰满，越鲜明，在一系列的的挫折中她改造了自我，改变了个人甚至整个家族的命运，成为时代时势造就的新女性的形象。↵作品在描绘人物生活与爱情的同时，勾勒出南北双方在政治，经济，文化各个层次的异同，具有浓厚的史诗风格，堪称美国历史转折时期的真实写照，同时也成为历久不衰的爱情经典。"
    title: "飘"
}
{
        "author": [
                "Wolfgang Mauerer"
        ],
        "binding": "平装",----
        "id": 6980,
        "image": "https://img1.doubanio.com/lpic/s4368169.jpg",
        "pages": "1038",---
        "price": "149.00元",---
        "pubdate": "201005",---
        "publisher": "人民邮电出版社",---
        "summary": "众所周知，Linux操作系统的源代码复杂、文档少，对程序员的要求高，要想看懂这些代码并不是一件容易事...",
        "title": "深入Linux内核架构",
}
```

####  书籍搜索

**URL**:

```
GET  /book/search
```

*该接口待完成，默认返回以下结果：*

````js
{
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
````

