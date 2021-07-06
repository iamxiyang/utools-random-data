const a = require("./random/address")

const paste = () => {
  console.log(222)
  if (utools.isMacOs()) {
    utools.simulateKeyboardTap('v', 'command')
  }
  if (utools.isWindows() || utools.isLinux()) {
    utools.simulateKeyboardTap('v', 'ctrl')
  }
};



window.exports = {
  "phone": { //随机生成手机号逻辑
    mode: "none",
    args: {
      // 进入插件时调用
      enter: (action) => {
        // action = { code, type, payload }
        window.utools.hideMainWindow()
        utools.copyText(54564);
        paste();
        window.utools.outPlugin()
      }
    }
  },
  "address": { //随机生成地址逻辑
    mode: "none",
    args: {
      // 进入插件时调用
      enter: (action) => {
        // action = { code, type, payload }
        window.utools.hideMainWindow()
        utools.copyText('地址');
        paste();
        window.utools.outPlugin()
      }
    }
  },
  "random": { //随机生成地址逻辑
    mode: "list",
    args: {
      // 进入插件时调用（可选）
      enter: (action, callbackSetList) => {
        // 如果进入插件就要显示列表数据
        callbackSetList([
          {
            title: '这是标题',
            description: '这是描述',
            icon: '' // 图标(可选)
          }
        ])
      },
      // 子输入框内容变化时被调用 可选 (未设置则无搜索)
      search: (action, searchWord, callbackSetList) => {
        // 获取一些数据
        // 执行 callbackSetList 显示出来
        callbackSetList([
          {
            title: '这是标题',
            description: '这是描述',
            icon: '', // 图标
            url: 'https://yuanliao.info'
          }
        ])
      },
      // 用户选择列表中某个条目时被调用
      select: (action, itemData, callbackSetList) => {
        window.utools.hideMainWindow()
        const url = itemData.url
        require('electron').shell.openExternal(url)
        window.utools.outPlugin()
      },
      // 子输入框为空时的占位符，默认为字符串"搜索"
      placeholder: "搜索"
    }
  },
}