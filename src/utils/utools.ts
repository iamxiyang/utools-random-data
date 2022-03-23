// 考虑到旧版本的数据兼容性，需要判断如果db中不存在数据，则考虑直接初始化，然后删掉json中的内容

utools.onPluginReady(() => {
    console.log('插件装配完成，已准备好')
})

// 每当插件从后台进入到前台时，uTools 将会主动调用这个方法。
utools.onPluginEnter(({code, type, payload}) => {
    console.log('用户进入插件', code, type, payload)
})

utools.onPluginDetach(() => {
    console.log('插件被分离')
})

// 当此插件的数据在其他设备上被更改后同步到此设备时，uTools 将会主动调用这个方法
utools.onDbPull(() => {
    console.log('onDbPull')
})


// 返回本插件所有动态增加的功能。
const features = utools.getFeatures()
console.log(features)

// 为本插件动态新增某个功能。
utools.setFeature({
    "code": "hosts",
    "explain": "hosts切换",
    // "icon": "res/xxx.png",
    // "icon": "data:image/png;base64,xxx...",
    "platform": ["win32", "darwin", "linux"],
    "cmds": ["hosts", "aaa"]
})

// 动态删除本插件的某个功能。
utools.removeFeature('code')

// 浏览器打开
utools.shellOpenExternal('https://u.tools')


// 存储只与当前设备相关的信息
const nativeId = utools.getNativeId() //获取本地 ID
utools.dbStorage.setItem(nativeId + '/key', 'native value')


// 判断插件是否在开发环境
if (utools.isDev()) {
    console.log('coding')
}

// 数据存储在本地计算机系统，如果用户开启同步，可在多个设备之间实现秒级同步。
// 数据库设计为离线优先，在没有网络时程序依然可以提供完整的服务。但在多个设备编辑同一个文档时，将产生冲突，数据库会统一选择一个版本作为最终版本，为了尽可能避免冲突，应该将内容合理的分散在多个文档，而不是都存放在一个文档中。

// 本地数据库
// 执行该方法将会创建或更新数据库文档，文档内容不超过 1M
// 创建请求
utools.db.put({
    _id: "demo",
    data: "demo"
})
// 返回 {id: "demo", ok: true, rev: "1-05c9b92e6f24287dc1f4ec79d9a34fa8"}

// 更新请求
utools.db.put({
    _id: "demo",
    data: "demo",
    _rev: "1-05c9b92e6f24287dc1f4ec79d9a34fa8"
})
// _id 代表这个文档在数据库中唯一值，如果值不存在，则会创建一个新的文档，如果值已经存在，则会进行更新。你可能已经注意到，返回对象中包含一个 rev 属性，这是代表此文档的版本，每次对文档进行更新时，都要带上最新的版本号，否则更新将失败，版本化的意义在于解决同步时数据冲突。
// 另外需要注意，每次更新时都要传入完整的文档数据，无法对单个字段进行更新。

// 在 uTools 的生命周期里， onPluginReady 事件回调执行前无法操作所有和数据库相关的操作，如果在 onPluginReady 执行完成前调用了数据库相关的 API，代码将会抛出一个异常


// 执行该方法将会根据文档 ID 获取数据
utools.db.get("demo")
// 执行该方法将会删除数据库文档，可以传入文档对象或文档 id 进行操作。
utools.db.remove("demo")

utools.db.bulkDocs([])
// docs Array
// 返回 Array
// 执行该方法将会批量更新数据库文档，传入需要更改的文档对象合并成数组进行批量更新。


utools.db.allDocs('key')
// key String | Array
// 返回 Array
// 执行该方法将会获取所有数据库文档，如果传入字符串，则会返回以字符串开头的文档，也可以传入指定 ID 的数组，不传入则为获取所有文档。


// 数据同步

//列表

//新增

//修改

//详情

// 粘贴指令
export const paste = () => {
    if (utools.isMacOs()) {
        utools.simulateKeyboardTap('v', 'command')
    }
    if (utools.isWindows() || utools.isLinux()) {
        utools.simulateKeyboardTap('v', 'ctrl')
    }
}

// 执行隐藏窗口、复制粘贴、退出插件步骤
export const copyPasteOut = (text: string) => {
    window.utools.hideMainWindow()
    utools.copyText(text)
    paste()
    window.utools.outPlugin()
}
