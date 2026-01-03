<template>
  <div class="page-container batch-page">
    <div class="page-header">
      <h2>批量生成</h2>
    </div>

    <div class="page-card">
      <!-- 配置区域 -->
      <div class="form-layout">
        <div class="form-item">
          <label>选择指令</label>
          <el-select 
            placeholder="请选择指令" 
            filterable 
            v-model="curFeature" 
            class="w-full"
            @change="onCommandChange"
          >
            <el-option v-for="item in commands" :key="item._id" :label="item.data?.explain" :value="item._id" />
          </el-select>
        </div>

        <div class="form-grid-2">
          <div class="form-item">
            <label>生成数量</label>
            <el-input-number 
              :min="1" 
              :max="500" 
              v-model="number" 
              step-strictly 
              class="w-full"
              @change="generateData"
            />
          </div>
          <div class="form-item">
            <label>分割符号</label>
            <el-input 
              placeholder="默认换行" 
              v-model="symbol"
              @change="generateData"
            />
          </div>
        </div>

        <el-checkbox v-model="isFilterRepeat" @change="generateData">
          过滤重复项
          <span class="checkbox-hint">（实际数量可能少于设定值）</span>
        </el-checkbox>
      </div>

      <div class="result-section">
        <div class="result-header" v-if="result">
          <span class="result-count">共 {{ resultCount }} 条数据</span>
        </div>
        <div class="result-container">
          <el-input 
            type="textarea" 
            v-model="result" 
            placeholder="生成结果将在此显示..." 
            :rows="8"
            readonly
            class="result-textarea"
          />
        </div>

        <div class="batch-actions">
          <el-button @click="copyResult" :disabled="!result">
            <el-icon class="mr-1"><CopyDocument /></el-icon>
            复制结果
          </el-button>
          <el-button type="primary" @click="generateData" :disabled="!curFeature">
            <el-icon class="mr-1"><Refresh /></el-icon>
            重新生成
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import { useAppStore } from '../../store/app.store'
  import { copyText } from '../../utils'
  import { runCmd } from '../../commands/parse'
  import { storeToRefs } from 'pinia'
  import { CopyDocument, Refresh } from '@element-plus/icons-vue'

  const appStore = useAppStore()
  const { commands } = storeToRefs(appStore)

  const route = useRoute()
  const { id = '' } = route.query

  const curFeature = ref('')
  const number = ref(10)
  const symbol = ref('\\r\\n')
  const result = ref('')
  const isFilterRepeat = ref(false)
  const resultCount = ref(0)

  onMounted(() => {
    if (id) {
      curFeature.value = id as string
      nextTick(() => {
        generateData()
      })
    }
  })

  const onCommandChange = () => {
    generateData()
  }

  const generateData = () => {
    if (!curFeature.value) return
    
    try {
      const command = commands.value.find((item: any) => item._id === curFeature.value)
      const content = command?.data.content
      if (!content) {
        ElMessage.error('该指令配置无效')
        return
      }

      let actualSymbol = symbol.value
      if (actualSymbol === '\\r\\n') actualSymbol = '\r\n'
      if (actualSymbol === '\\n') actualSymbol = '\n'
      if (actualSymbol === '\\t') actualSymbol = '\t'

      const arr = []
      for (let i = 0; i < number.value; i++) {
        arr.push(runCmd(content))
      }

      const finalArr = isFilterRepeat.value ? [...new Set(arr)] : arr
      resultCount.value = finalArr.length
      result.value = finalArr.join(actualSymbol)
    } catch (e) {
      ElMessage.error('生成失败，指令脚本可能存在错误')
    }
  }

  const copyResult = () => {
    if (!result.value) {
      return ElMessage.warning('暂无内容可复制')
    }
    copyText(result.value)
    ElMessage.success('已复制到剪贴板')
  }
</script>

<style scoped lang="scss">
  .batch-page {
    max-width: 700px;
  }

  .form-layout {
    margin-bottom: 16px;
  }

  .form-item {
    label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }

  .checkbox-hint {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  .result-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-lighter);
  }

  .result-header {
    margin-bottom: 8px;
    
    .result-count {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }

  .result-container {
    .result-textarea {
      :deep(.el-textarea__inner) {
        font-family: 'Fira Code', Consolas, var(--el-font-family-monospace);
        font-size: var(--app-table-font-size);
        line-height: 1.6;
        max-height: 400px;
        background: var(--el-fill-color-lighter);
        border-color: var(--el-border-color-lighter);
        
        &:focus {
          background: var(--el-bg-color);
        }
      }
    }
  }

  .batch-actions {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .mr-1 {
    margin-right: 4px;
  }
</style>
