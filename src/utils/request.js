// 基于 axios 封装的请求模块
import theAxios from 'axios'
import router from '@/router'
import { Notify } from 'vant'
import { getToken } from './token'
// 新建一个新的axios实例
const axios = theAxios.create({
  baseURL: 'https://toutiao.itheima.net', // 基地址
  timeout: 20000 // 超时时间20秒
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 目标：统一携带token
  // 判断本地有token再携带，判断具体api/index.js里如果没有携带Authorization，再添加上去
  // 未定义叫undefined，null具体的值得赋予才叫空
  // ?. 可选链操作符，如果前面对象里没有length，整个表达式原地返回undefined
  // 如果getToken()在原地有值token字符串，才能调用length获取长度
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
    // console.log(config)
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
// 本质：就是一个函数
axios.interceptors.response.use(function (response) {
  // http响应状态码为2xx，3xx就进入这里
  // 对响应数据做点什么
  return response
}, function (error) {
  // http响应状态码为4xx，5xx报错进入这里
  // 对响应错误做点什么
  console.dir(error)
  // console.log(this) // undefined 不是vue原型
  // 只有401才代表身份过期，才需要跳转
  if (error.response.status === 401) {
    // 不能使用this.$router (因为this不是vue组件对象无法调用$router)
    // 解决：this.$router为了拿到router路由对象，所以直接去上面引入@/router下router对象
    Notify({ type: 'warning', message: '身份已过期' })
    router.replace('/login')
  }
  return Promise.reject(error)
})

// 导出自定义函数, 参数对象解构赋值
export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => {
  return axios({
    url, // 请求地址
    method, // 请求方式
    params, // 传参
    data, // 请求体传参
    headers // 请求头
  })

// 以后换库, 只需要改这里, 逻辑页面不用动, 保证代码的复用性和独立性(高内聚低耦合)
// import $ from 'jquery'
// export default $.ajax
//   return $.ajax({
//     url: url,
//     type: method,
//     data: data,
//     header: headers
//   })
}
