# utools-random-data

一款 uTools 插件，用于生成随机数据，在系统开发等场景极其有用。目前已经支持 **_多种数据自己组合_**、**_正则语法随机生成内容_**、**_批量生成_** 等特色功能。如果帮到了你，请点一个 Star！

该插件的目的是帮助开发和测试人员在开发阶段进行数据测试，所有生成的数据都是虚假的，只确保符合特定校验规则，并不是真实存在的。

> 项目使用 Vite、Vue3、pinia、Element Plus 等技术进行开发，开发过程中参考了 mockjs、random-something 等开源库的实现。其中日期格式化使用 dayjs、正则生成数据使用 reregexp

## 下载

1. uTools 插件中心搜索【随机生成虚假数据】找到插件直接下载安装使用。
1. 官方离线中心 <https://api.u-tools.cn/Plugins/developer/allPlugins> 搜索【随机生成虚假数据】下载后拖到 uTools 输入框安装使用。

## 使用

1. 安装后在 uTools 输入框直接输入`随机生成`或拼音首字母`sjcs` 能够看到`随机生成数据插件全部指令`功能选项，进入后选择需要的随机数据即可生成数据。
2. 如果觉得这样操作比较麻烦，在输入框中输入`随机生成数据插件设置` 能够看到 **设置** 选项，开启**快捷启动** 后就能直接在 uTools 中输入唤醒词汇使用，未开启的功能指令依旧能在全部指令中使用。
3. 在设置中除了设置快捷启动，还能对默认的规则进行修改，或新增自定义功能指令。点击新增/修改，在指令内容输入框插入变量，可以进行组合。变量解析后的效果可以点击测试或侧边栏中的内置变量查看。
4. 如果需要批量生成数据，可以先创建指令，在侧边栏中找到 **批量生成** 选择指令就能批量生成了，目前单次最多可生成 500 条。

## 常见问题

1. 为什么执行后没有结果？  
   插件在生成数据后，会自动尝试把内容粘贴到你的输入框，但某些场景无法自动输入，如果没有自动输入，也可以手动粘贴使用。

## 参与贡献

非常欢迎你的加入！[提一个 Issue](https://github.com/iamxiyang/utools-random-data/issues/) 或者提交一个 Pull Request。

**Pull Request:**

1. Fork 代码!
2. 创建自己的分支: `git checkout -b feat/xxxx`
3. 提交你的修改: `git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支: `git push origin feat/xxxx`
5. 提交`pull request`

**Git 贡献提交规范:**

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))  
  - `feat` 增加新功能  
  - `fix` 修复问题/BUG  
  - `style` 代码风格相关无影响运行结果的  
  - `perf` 优化/性能提升  
  - `refactor` 重构  
  - `revert` 撤销修改  
  - `test` 测试相关  
  - `docs` 文档/注释  
  - `chore` 依赖更新/脚手架配置修改等  
  - `workflow` 工作流改进
  - `ci` 持续集成  
  - `types` 类型定义文件更改  
  - `wip` 开发中  

## 打赏作者

如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励 🍹。

![打赏](https://test-1309419893.cos.ap-shanghai.myqcloud.com/%E6%89%93%E8%B5%8F.jpg)
