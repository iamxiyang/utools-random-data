<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
<script setup lang="ts">
  import zhCn from 'element-plus/lib/locale/lang/zh-cn'
  import { delAllCmds, initCmds } from './utils/init'
  import { runCmd } from './utils/random'
  import router from './router'

  utools.onPluginReady(() => {
    // NOTE 调试阶段，清空全部
    // delAllCmds();
    // 初始化数据
    initCmds()
  })

  utools.onPluginEnter(async ({ code, type, payload }) => {
    console.log('用户进入插件', code, type, payload)
    if (code === 'setting') {
      await router.replace({ name: 'index' })
      return
    }
    if (code === 'random-all') {
      //  所有指令的列表，方便选择未添加到utools快捷启动的命令
      await router.replace({ name: 'random-all' })
      return
    }
    // 获取指令对应的配置内容，执行生成指令，然后退出插件
    const dbData = utools.db.get(code)
    console.log(dbData)
    if (dbData) {
      const { data } = dbData
      await runCmd(data.content)
      utools.outPlugin()
    }
  })
</script>
<style lang="scss">
  body {
    margin: 0;
  }

  .m-y-20 {
    margin-top: 20px !important;
    margin-bottom: 20px !important;
  }

  .w-200 {
    width: 200px;
  }
</style>
