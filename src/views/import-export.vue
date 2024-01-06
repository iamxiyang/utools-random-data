<template>
  <h2 class="m-y-20px">导入导出</h2>
  <p>导入导出功能，可以方便的在不同设备间同步 变量和指令 等插件数据。</p>
  <p>如果是自己多设备使用，建议使用 utools 会员提供的数据同步，而不是依赖该功能。</p>
  <p>目前属于测试阶段，如有问题请反馈。</p>

  <el-button type="primary" @click="onReset">重置所有数据</el-button>
  <el-button type="primary" @click="exportData">导出数据</el-button>
  <el-button type="primary" @click="importData">导入数据</el-button>
</template>

<script setup lang="ts">
  import LZString from 'lz-string'
  import { useAppStore } from '../store/app.store'
  import packageJson from '../../package.json'
  import { ElMessageBox } from 'element-plus'
  import cloneDeep from 'lodash.clonedeep'
  import defaultCommands from '../commands/default'
  import defaultStringVariables from '../variables/string.default'

  const { saveFile, readFile } = window.preload

  // NOTE：如果你看到了这里的逻辑，不要尝试修改导出后的信息，可能会出现数据丢失、插件功能异常等问题，你需要对自己的数据负责。

  const appStore = useAppStore()

  // 清空现有 utools 的数据，pinia 监控到数据变化后会自动从 utools 中删除
  const removeAll = () => {
    appStore.commands = []
    appStore.variables = []
  }

  const onReset = () => {
    ElMessageBox.confirm('确定要重置所有数据吗？会导致您之前的所有修改都被清空。', '重置提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      removeAll()
      ElMessageBox.alert('重置成功', '重置成功', {
        confirmButtonText: '确定',
        type: 'success',
      })
      setTimeout(() => {
        appStore.commands = cloneDeep(defaultCommands)
        appStore.variables = cloneDeep(defaultStringVariables)
      }, 1000)
    })
  }

  const exportData = async () => {
    const _state = toValue(appStore.$state)
    const data = {
      version: packageJson.version,
      commands: _state.commands,
      variables: _state.variables,
    }
    const compressedString = LZString.compressToEncodedURIComponent(JSON.stringify(data))
    const savePath = utools.showSaveDialog({
      title: '保存位置',
      defaultPath: `${utools.getPath('desktop')}/随机数据插件导出.rbak`,
      buttonLabel: '保存',
    })
    if (!savePath) return
    await saveFile(savePath, compressedString)
    utools.shellShowItemInFolder(savePath)
  }

  const importData = async () => {
    const filePath = utools.showOpenDialog({
      title: '选择导入文件',
      buttonLabel: '导入',
    })
    if (!filePath) return
    const fileContent = await readFile(filePath[0])
    const data = JSON.parse(LZString.decompressFromEncodedURIComponent(fileContent))
    if (!data) {
      ElMessageBox.alert('导入的数据格式不正确', '导入失败', {
        confirmButtonText: '确定',
        type: 'error',
      })
      return
    }
    if (data.version !== packageJson.version) {
      await ElMessageBox.confirm('导入的数据版本与当前插件版本不一致，可能会导致数据丢失或插件功能异常。', '版本不一致', {
        confirmButtonText: '继续导入',
        cancelButtonText: '取消',
        type: 'warning',
      })
    }
    await ElMessageBox.confirm('继续导入将清空现有数据，是否继续？', '数据提示', {
      confirmButtonText: '继续导入',
      cancelButtonText: '取消',
      type: 'warning',
    })
    removeAll()
    setTimeout(() => {
      appStore.$patch(data)
      ElMessageBox.alert('导入成功', '导入成功', {
        confirmButtonText: '确定',
        type: 'success',
      })
    }, 1000)
  }
</script>

<style scoped lang="scss">
  p {
    font-size: 16px;
    margin-bottom: 20px;
  }
</style>
