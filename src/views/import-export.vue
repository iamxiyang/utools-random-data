<template>
  <div class="page-container">
    <div class="page-header">
      <h2>导入导出</h2>
    </div>

    <div class="import-export-content">
      <div class="info-alert">
        <div class="alert-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <div class="alert-body">
          <p>导入导出功能可以方便地在不同设备间同步 <strong>变量</strong> 和 <strong>指令</strong> 等插件数据。</p>
          <p class="hint">如果您在多设备间使用，建议开启 uTools 会员的数据同步功能，体验更佳。</p>
        </div>
      </div>

      <div class="action-grid">
        <div class="action-card" @click="exportData">
          <div class="card-icon export">
            <el-icon><Download /></el-icon>
          </div>
          <div class="card-info">
            <h3>导出数据</h3>
            <p>将当前配置备份为本地文件</p>
          </div>
          <el-icon class="arrow"><ArrowRight /></el-icon>
        </div>

        <div class="action-card" @click="importData">
          <div class="card-icon import">
            <el-icon><Upload /></el-icon>
          </div>
          <div class="card-info">
            <h3>导入数据</h3>
            <p>从本地备份文件中恢复配置</p>
          </div>
          <el-icon class="arrow"><ArrowRight /></el-icon>
        </div>

        <div class="action-card danger" @click="onReset">
          <div class="card-icon reset">
            <el-icon><RefreshRight /></el-icon>
          </div>
          <div class="card-info">
            <h3>重置所有数据</h3>
            <p>清空自定义配置并恢复默认状态</p>
          </div>
          <el-icon class="arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LZString from 'lz-string'
  import { useAppStore } from '../store/app.store'
  import packageJson from '../../package.json'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import cloneDeep from 'lodash.clonedeep'
  import defaultCommands from '../commands/default'
  import defaultStringVariables from '../variables/string.default'
  import { InfoFilled, Download, Upload, RefreshRight, ArrowRight } from '@element-plus/icons-vue'

  import dayjs from 'dayjs'

  const { saveFile, readFile } = window.preload

  const appStore = useAppStore()

  /** 清理所有当前已注册的 uTools Features */
  const clearAllCurrentFeatures = () => {
    try {
      if (appStore.commands && Array.isArray(appStore.commands)) {
        appStore.commands.forEach(cmd => {
          if (cmd.data?.feature) {
            const code = cmd.data.code || cmd._id
            utools.removeFeature(code)
            console.log('[DEBUG] 重置清理 Feature:', code)
          }
        })
      }
    } catch (e) {
      console.warn('Clear features failed:', e)
    }
  }

  const onReset = () => {
    ElMessageBox.confirm('确定要重置所有数据吗？这将导致您之前的所有自定义指令和变量被清空，且已注册的快捷启动也将被移除。', '警告', {
      confirmButtonText: '确定重置',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger',
    }).then(() => {
      // 1. 先显式移除所有 Feature
      clearAllCurrentFeatures()
      
      // 2. 批量重置数据
      appStore.$patch({
        commands: cloneDeep(defaultCommands),
        variables: cloneDeep(defaultStringVariables)
      })
      ElMessage.success('数据已重置')
    })
  }

  const exportData = async () => {
    try {
      const data = {
        version: packageJson.version,
        commands: toRaw(appStore.commands),
        variables: toRaw(appStore.variables),
        exportTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      
      const compressedString = LZString.compressToEncodedURIComponent(JSON.stringify(data))
      const savePath = utools.showSaveDialog({
        title: '导出数据备份',
        defaultPath: `${utools.getPath('desktop')}/随机数据插件备份_${dayjs().format('YYYYMMDD')}.rbak`,
        buttonLabel: '导出',
      })
      
      if (!savePath) return
      
      const success = await saveFile(savePath, compressedString)
      if (success) {
        ElMessage.success('导出成功')
        utools.shellShowItemInFolder(savePath)
      }
    } catch (e) {
      console.error('Export failed:', e)
      ElMessage.error('导出失败')
    }
  }

  const importData = async () => {
    const filePath = utools.showOpenDialog({
      title: '选择备份文件',
      buttonLabel: '导入',
      filters: [{ name: '备份文件', extensions: ['rbak'] }]
    })
    
    if (!filePath || filePath.length === 0) return
    
    try {
      const fileContent = await readFile(filePath[0])
      const data = JSON.parse(LZString.decompressFromEncodedURIComponent(fileContent))
      
      if (!data || (!data.commands && !data.variables)) {
        throw new Error('Invalid format')
      }

      const countMsg = `检测到备份包含：${data.commands?.length || 0} 条指令，${data.variables?.length || 0} 个变量。`

      if (data.version !== packageJson.version) {
        await ElMessageBox.confirm(`${countMsg}<br><br><b>提醒：</b>备份版本 (${data.version}) 与当前版本 (${packageJson.version}) 不一致，是否继续？`, '版本提醒', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '继续导入',
          cancelButtonText: '取消',
          type: 'warning',
        })
      } else {
        await ElMessageBox.confirm(`${countMsg}<br><br>确认导入吗？导入将覆盖当前所有数据。`, '导入确认', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '立即导入',
          cancelButtonText: '取消',
          type: 'warning',
        })
      }

      // 1. 导入前先彻底清理旧的 Feature 注册
      clearAllCurrentFeatures()

      // 2. 预处理数据：移除旧的 _rev
      const cleanCommands = (data.commands || []).map((item: any) => {
        const newItem = cloneDeep(item)
        delete newItem._rev
        return newItem
      })
      const cleanVariables = (data.variables || []).map((item: any) => {
        const newItem = cloneDeep(item)
        delete newItem._rev
        return newItem
      })

      // 执行原子更新
      appStore.$patch({
        commands: cleanCommands,
        variables: cleanVariables
      })

      ElMessageBox.alert('数据导入成功', '导入成功', {
        confirmButtonText: '完成',
        type: 'success',
      })
    } catch (e) {
      console.error('Import failed:', e)
      ElMessageBox.alert('导入失败：文件损坏或格式不正确', '错误', {
        type: 'error',
      })
    }
  }
</script>

<style scoped lang="scss">
  .import-export-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .info-alert {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    background: var(--el-color-primary-light-9);
    border-radius: 8px;
    border: 1px solid var(--el-color-primary-light-8);

    .alert-icon {
      font-size: 24px;
      color: var(--el-color-primary);
    }

    .alert-body {
      p {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: var(--el-text-color-primary);

        &.hint {
          margin-top: 4px;
          color: var(--el-text-color-secondary);
          font-size: 13px;
        }
      }
    }
  }

  .action-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .action-card {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
      transform: translateY(-1px);

      .card-icon {
        background: var(--el-color-primary);
        color: white;
      }

      .arrow {
        transform: translateX(4px);
        color: var(--el-color-primary);
      }
    }

    &.danger:hover {
      border-color: var(--el-color-danger);
      background: var(--el-color-danger-light-9);

      .card-icon {
        background: var(--el-color-danger);
      }

      .arrow {
        color: var(--el-color-danger);
      }
    }

    .card-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-right: 16px;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-secondary);
      transition: all 0.3s;
    }

    .card-info {
      flex: 1;

      h3 {
        margin: 0 0 4px;
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      p {
        margin: 0;
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
    }

    .arrow {
      font-size: 18px;
      color: var(--el-text-color-placeholder);
      transition: all 0.3s;
    }
  }
</style>
