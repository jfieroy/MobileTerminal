// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

// 不要手动写绝对路径, 用代码来动态获取, 绝对地址
const path = require('path')
module.exports = {
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        // lessOptions: {
        modifyVars: {
          // 直接覆盖变量
          // 'nav-bar-background-color': 'lightcoral',
          // 'nav-bar-title-text-color': '#fff'
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          // __dirname（2个下划线）它是node环境下的全局内置变量
          // 当前文件所在文件夹的绝对路径
          // __dirname 值: F:\Workspace\Vue\tt
          hack: `true; @import "${path.join(__dirname, '/src/styles/cover.less')}";`
        }
        // },
      }
    }
  }
}
