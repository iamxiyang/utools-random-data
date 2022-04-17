TODO 所有的数据放到 pinia ，由 pinia 监控数据变化同步到 utools 相关内容
如果是 utools 环境则启用变化同步，如果是浏览器环境则控制台输入 error 提示目前仅供调试，保存的配置刷新后失效，不会持久化
和 utools 环境解耦，可以尝试其他环境使用。
可以尝试通过 pinia 的插件进行副作用操作

编辑页面交互
批量生成页面交互

写一个变量列表，可以复制或直接使用变量？

3、内容解析、生成算法
4、内置变量
5、页面解析、配置

# utools-random-data

vite + vue3 + ts + element-plus + scss + pinia + utools api + reregexp

## 目录结构

src  
-- assets 静态资源，通常不需要改动
-- components 公共组件
-- pages 页面组件
-- mock 随机数据生成逻辑目录
-- 主逻辑
store 配置数据、存放配置、实时和 utools 同步
utils
-- random 和 random 文件对应
-- 助手，一些函数封装
