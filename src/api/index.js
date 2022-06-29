// 统一封装接口方法
// 每个方法负责请求一个url地址
// 逻辑页面，导入这个接口方法，就能发请求
// 好处：请求url路径，可以在这统一管理

// import axios from '@/utils/request.js'
import request from '@/utils/request.js'
// import { getToken } from '@/utils/token.js'

// 登录 - 登录接口
// axios内部，会把参数对象转成json字符串格式发后台
// axios内部，会自动携带请求参数(headers)里Content-Type: 'application/json' 直接添加好
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})

// 用户 - 关注
export const userFollowedAPI = ({ userId }) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: userId
  }
})

// 用户 - 取消关注
export const userUnFollowedAPI = ({ userId }) => request({
  url: `/v1_0/user/followings/${userId}`,
  method: 'DELETE'
})

// 用户 - 获取个人资料(编辑页面使用)
export const userProfileAPI = () => request({
  url: '/v1_0/user/profile'
})

// 用户 - 获取基本信息(我的页面显示数据)
export const getUserInfoAPI = () => request({
  url: '/v1_0/user'
})

// 用户 - 更新头像
export const updateUserPhotoAPI = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd // fd是外面一会儿传进来的new FormData() 表单对象

  // 如果请求体直接是FormData表单对象, 也不用自己添加
  // Content-Type, axios发现数据请求体是表单对象, 它也不会转换成json字符串
  // 也不会带Content-Type: application/json, 而是交给浏览器, 浏览器发现请求体是formData会自己携带Content-Type

  // Content-Type: application/json; axios携带, 前提: data请求体是对象 -> json字符串 -> 发给后台
  // Content-Type: multipart/form-data; 浏览器携带的, 前提: data请求体必须是FormData类型对象
})

// 用户 - 更新基本资料
export const updateUserProfileAPI = (dataObj) => {
  // 判断, 有值才带参数名给后台, 无值参数名不携带
  // 写法1: 结构赋值, 4个判断, 往空对象上添加有值的
  // 写法2: 外面想传几对key+value, 就直接传入交给后台
  // 写法3: 上面写法不够语义化, 看不出obj里有什么

  const obj = {
    name: '',
    gender: 0,
    birthday: '',
    intro: ''
  }

  for (const prop in obj) { // 遍历参数对象里每个key
    if (dataObj[prop] === undefined) { // 用key去外面传入的参数对象匹配, 如果没有找到, 证明外面没传这个参数
      delete obj[prop] // 从obj上移除这对属性和值
    } else {
      obj[prop] = dataObj[prop] // 如果使用了, 就从外面对象取出对应key值, 保存到obj上
    }
  }
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH', // 局部更新 -> PUT(全部更新)
    data: obj
    // { // data不会忽略值为null的那对key+value, params遇到null值会忽略不携带参数和值给后台
    //   name, // 昵称
    //   gender, // 性别, 0-男, 1-女
    //   birthday, // 生日, 格式: 年-月-日 字符串
    //   intro // 个人介绍
    // }
  })
}

// 频道 - 获取所有频道
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})

// 获取 - 获取用户选择的频道
// 注意：用户没有登录，默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels',
  method: 'GET'
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // }
})

// 频道 - 更新覆盖频道
export const updateChannelsAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    channels // 用户已选整个频道数组
  }
})

// 频道 - 删除用户指定的频道
export const removeTheChannelAPI = ({ channelId }) => request({
  url: `/v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})

// 文章 - 获取列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'GET',
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // },
  params: { // 这里的参数，axios会帮忙拼接在URL?后面 (查询字符串)
    channel_id,
    timestamp
  }
})

// 文章 - 反馈 - 不感兴趣
export const dislikeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // },
  data: {
    target: artId
  }
})

// 文章 - 反馈 - 反馈垃圾内容
export const reportArticleAPI = ({ artId, type }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // },
  data: {
    target: artId,
    type: type,
    remark: '可以在逻辑页面判断,如果点击类型是0,再给一个弹出框输入框输入其他问题,传参到这里'
  }
})

// 文章 - 获取详情
export const detailAPI = ({ artId }) => request({
  url: `/v1_0/articles/${artId}`
})

// 文章 - 点赞
export const likeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})

// 文章 - 取消点赞
export const unLikeArticleAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})

// 文章 - 获取 - 评论列表
export const commentsListAPI = ({ id, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: { // axios只针对params参数, 如果发现键值对, 值为null,会忽略此参数名和值不携带在url?后面
    type: 'a', // 什么时候需要外面传: 此值会变化
    source: id,
    offset,
    limit
  }
})

// 文章 - 评论 - 喜欢
export const commentLikingAPI = ({ comId }) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: comId
    }
  })
}

// 文章 - 评论 - 取消喜欢
export const commentDisLikingAPI = ({ comId }) => {
  return request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
  })
}

// 文章 - 评论 - 发布评论
export const commentSendAPI = ({ id, content, art_id = null }) => {
  // 1. axios中,data请求体传参,如果值为null是不会忽略这个参数的
  // 也会把参数名和值携带给后台 (只有params遇到null才会忽略)
  // 2. 形参art_id可选参数, 如果逻辑页面是对文章评论, 则不需要传递art_id
  // 所以这时, 内部art_id值为null就证明此次调用, 是针对文章评论

  // data请求体对象需要自己处理
  const obj = {
    target: id,
    content
  }
  if (art_id !== null) { // 如果本次有第三个参数,证明是对评论进行回复
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}

// 搜索 - 联想菜单
// 心理活动belike：从外边调API方法，小括号箭头发请求，小括号里边需要外边传一个关键字，就在形参上定义一个变量，但是外边想让它传对象，就用对象的结构赋值
export const suggestListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  method: 'GET',
  params: {
    q: keywords
  }
})

// 搜索 - 搜索结果列表
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
  url: '/v1_0/search',
  params: {
    page,
    per_page,
    q
  }
})
