import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 引入flexible.js -> 设置根标签字体大小（移动端适配）
import {
  NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, List, PullRefresh,
  ActionSheet, Popup, Row, Col, Badge, Search, Image as VanImage, Divider, CellGroup, Tag,
  Dialog, DatetimePicker
} from 'vant'

Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(CellGroup)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(VanImage)
Vue.use(Search)
Vue.use(Row)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)
Vue.config.productionTip = false

// 封装中间件函数插件
const directiveObj = {
  install () {
    Vue.directive('fofo', {
      // el代表指令所在标签
      // 指令所在标签, 被插入到真实DOM时才触发, 如果标签用display:none隐藏再出现, 不会再触发inserted
      inserted (el) {
        // 指令所在van-search组件
        // 组件根标签是div，input在内部
        // 以上都是原生标签对象

        // 搜索页面 el是div
        // 文章评论 el是textarea
        // 以后el还可能是input
        // 知识点: 原生DOM.nodeName 拿到标签名字 (注意: 大写的字符串)
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // el本身不是输入框,尝试往里获取一下
          const theInput = el.querySelector('input')
          const theTextArea = el.querySelector('textarea')
          // 判断: 不一定能获取得到, 需要加判断 有值了, 再执行.focus()才不报错
          if (theInput) theInput.focus()
          if (theTextArea) theTextArea.focus()
        }
        // const theInput = el.querySelector('input')
        // theInput.focus()
      },
      update (el) { // 指令所在标签被更新时触发
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // el本身不是输入框,尝试往里获取一下
          const theInput = el.querySelector('input')
          const theTextArea = el.querySelector('textarea')
          // 判断: 不一定能获取得到, 需要加判断 有值了, 再执行.focus()才不报错
          if (theInput) theInput.focus()
          if (theTextArea) theTextArea.focus()
        }
      }
    })
  }
}
// 执行目标对象里install方法并传入Vue类
Vue.use(directiveObj)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 目标1：有2处在检查代码
// vscode+eslint插件，在工作区根目录下.eslint.js配置，在保存时，检查代码
// 如果在写代码时用插件检查问题，webpack就不报错了
// webpack开发服务器（在下面终端中）+eslint插件，在保存时，检查代码

// 目标2：组件使用套路
// 1.明确目标，找到类似组件
// 2.引入注册然后复制过来
// 3.读和删没用的
// 4.修改，改成需要的样子
// eg：Login中的NavBar https://vant-contrib.gitee.io/vant/#/zh-CN/nav-bar
// 样式修改：
// (1)：找到类名，自己写css覆盖上去
// (2)：看文档，是否支持自定义样式
