<template>
  <div>
    <!-- 头部导航
         fixed可以让头部div带固定定位的样式
         (原理：给组件内props传入true/false)
         (影响到组件内动态样式:class)
    -->
    <div>
      <van-nav-bar fixed>
        <template v-slot:left>
          <img class="logo" src="@/assets/logo.png" alt="" />
        </template>
        <template #right>
          <!-- 坑：postcss只能翻译style里css样式代码，标签内行内样式它无法转换px转rem，
          所以需要自己手动计算 -->
          <van-icon name="search" size="0.48rem" color="#fff" @click="moveSearchPageFn"/>
        </template>
      </van-nav-bar>
    </div>
    <!-- 1. Tab栏导航
          van-tabs 一行容器
          van-tab 每个tab栏
          v-model关联的激活项的下标(双向绑定)
          tab栏+内容

         2. 坑：sticky参照"父级div标签"进行粘性布局，如果body/html设置高度，父级div一起走了，所以内部sticky也上去

         3. (重要)每个van-tab代表一个标签导航，中间夹着内容，对应的下属列表内容
         4. (重要)每个van-tab都对应独立的自己的ArticleList(多次)
         5. 细节
         van-tab循环了很多标签导航，与之一一对应的内容列表不是上来都创建的，默认创建当前激活导航对应列表组件
         第一次切换到对应频道时，才会创建下属的ArticleList组件->created方法
         第二次切换就是显示/隐藏切换
    -->
    <div class="main">
      <van-tabs
        v-model="channelId"
        @change="channelChangeFn"
        sticky
        offset-top="1.226667rem"
      >
        <van-tab
          :title="obj.name"
          v-for="obj in userChannelList"
          :key="obj.id"
          :name="obj.id"
        >
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道图标 -->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="plusClickFn"/>
    </div>
    <!-- 频道管理弹出层 -->
    <van-popup class="channel_popup" v-model="show" get-container="body">
      <ChannelEditVue
      :userList="userChannelList"
      :uncheckList="unCheckChannelList"
      @addChannelEV="addChannelFn"
      @removeChannelEV="removeChannelFn"
      @closeEV="closeFn"
      ref="editRef"
      v-model="channelId"
      ></ChannelEditVue>
    </van-popup>
  </div>
</template>

<script>
import {
  getUserChannelsAPI,
  getAllChannelsAPI,
  updateChannelsAPI,
  removeTheChannelAPI
} from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEditVue from './ChannelEdit.vue'

// 目标1：获取不同的文章列表，需要传递不同的频道ID
// 想法：让van-tabs的v-model关联频道ID

// 目标2：点击tab标签页@change触发，重新发送请求，拿到新的数据
// 问题：每次切换tab拿到的数据都是新的
// 即使用keep-alive也没用(防止组件被销毁，而组件没有被销毁，是在点击切换数据)
// 解决：外面现在用的是同一个数组切换数据(对个ArticleList用的是同一个数组，换会影响别人)
// 文章列表数据，请求，数组，分别放入到ArticleList内部(自己请求自己的数据)
// 外面只负责传入当前激活的频道ID
export default {
  data () {
    return {
      channelId: 0, // tab导航-激活频道ID (默认频道ID为0，页面刚打开时默认推荐频道高亮-对应文章数据)
      userChannelList: [], // 用户选择频道列表
      allChannelList: [], // 所有频道列表
      // articleList: [] // 文章列表
      show: false // 频道弹出层显示/隐藏
    }
  },
  async created () {
    // 频道列表
    const res = await getUserChannelsAPI()
    // console.log(res)
    this.userChannelList = res.data.data.channels
    // this.channelChangeFn()

    // 所有频道列表
    const res2 = await getAllChannelsAPI()
    console.log(res2)
    this.allChannelList = res2.data.data.channels
  },
  methods: {
    // tabs切换的事件 -> 获取文章列表数据
    async channelChangeFn () {
      // 文章列表
      // const res2 = await getAllArticleListAPI({
      //   channel_id: this.channelId, // 先默认请求推荐频道数据
      //   timestamp: (new Date()).getTime()
      // })
      // console.log(res2)
      // this.articleList = res2.data.data.results
    },
    // +号点击方法
    plusClickFn () {
      this.show = true
    },
    // 添加频道
    async addChannelFn (channelObj) {
      this.userChannelList.push(channelObj)
      // 问题：为何只需要push，不需要从下面数组里移除
      // 未选数组是计算属性
      // 还要把最新的数组发送到后台
      // 数组里对象字段 -> 转换
      // 推荐频道不能传递-删除出不是推荐频道剩下的频道对象
      // const newArr = this.userChannelList.filter(obj => obj.id !== 0)
      // newArr.forEach((obj, index) => {
      //   // delete 对象.属性 可以删除键值对
      //   delete obj.name
      //   obj.seq = index
      // })
      // const res = await updateChannelsAPI({
      //   channels: newArr
      // })
      // console.log(res)

      // 上面代码出问题，新增时，名字被删除了
      // 原因：所有数组里的对象，都是同一个内存地址，影响到ChannelEdit.vue内对象
      // 解决方法
      const newArr = this.userChannelList.filter(obj => obj.id !== 0)
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj } // 拷贝(浅拷贝)
        delete newObj.name
        newObj.seq = index
        return newObj // 让map方法把新对象收集起来形成一个新数组
      })
      const res = await updateChannelsAPI({
        channels: theNewArr
      })
      console.log(res)
    },
    // 删除频道
    async removeChannelFn (channelObj) {
      const index = this.userChannelList.findIndex(obj => obj.id === channelObj.id)
      this.userChannelList.splice(index, 1)

      // 第一种方式：把现在用户数组的数据，再覆盖式得发给后台
      // 需要把上面的更新数据过程，封装一个函数，add和remove里调用
      // 第二种方式：只调用删除的接口
      const res = await removeTheChannelAPI({
        channelId: channelObj.id
      })
      console.log(res)
      // 知道：删除接口返回状态码204(Not Content) 无返回内容
    },
    // 关闭弹出层
    closeFn () {
      this.show = false
      // 让内部的编辑状态回归false
      this.$refs.editRef.isEdit = false
    },
    // 首页-右上角放大镜点击事件 -> 跳转搜索页面
    moveSearchPageFn () {
      this.$router.push('/search')
    }
  },
  components: {
    ArticleList,
    ChannelEditVue
  },
  // 计算属性
  computed: {
    unCheckChannelList () { // 定义一个变量
      // 目标：把所有频道数组挨个对象取出，去用户已选频道数组里查找，如果找不到，则让filter方法收集到一个新数组
      // const newArr = this.allChannelList.filter(bigObj => {
      //   const index = this.userChannelList.findIndex(smallObj => {
      //     return smallObj.id === bigObj.id
      //   })

      //   // 如果找到了
      //   if (index > -1) {
      //     return false
      //   } else {
      //     return true
      //   }
      // })
      // return newArr
      return this.allChannelList.filter(bigObj => (this.userChannelList.findIndex(smallObj => smallObj.id === bigObj.id) === -1))
    }
  }
}
</script>

<style scoped lang="less">
.logo {
  width: 100px;
  height: 30px;
}
.main {
  padding-top: 46px;
  /* 底部在Layout/index.vue-给二级路由挂载点容器上
  给了一个padding-bottom */
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}
// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}

// 弹出层样式
.channel_popup {
  width: 100vw;
  height: 100vh;
}
// 如果想给100%，要先给html和body设置100%
// vw和vh是css3新出的单位，参考浏览器窗口的百分比
</style>
