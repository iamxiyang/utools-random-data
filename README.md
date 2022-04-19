<!-- TODO -->

所有内置变量列表，罗列好（优先）
生成随机数据方法优化
时间随机，改成只允许几个特定类型，允许配置格式化规则，待测试
Pinia 副作用储存调试

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
