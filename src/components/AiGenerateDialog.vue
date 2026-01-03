<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="500px"
    :close-on-click-modal="!isGenerating"
    :close-on-press-escape="!isGenerating"
    @open="handleOpen"
    class="ai-generate-dialog"
  >
    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>正在加载 AI 模型...</span>
    </div>
    <div v-else-if="models.length === 0" class="empty-state">
      <el-icon><Warning /></el-icon>
      <span>未找到可用的 AI 模型</span>
      <p class="hint">请先在 uTools 设置中配置 AI 模型</p>
    </div>
    <el-form v-else label-position="top">
      <el-form-item label="选择 AI 模型">
        <el-select v-model="selectedModel" placeholder="请选择模型" class="w-full">
          <el-option
            v-for="model in models"
            :key="model.id"
            :label="model.label"
            :value="model.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述需求">
        <el-input
          v-model="description"
          type="textarea"
          :rows="4"
          :placeholder="placeholder"
          :disabled="isGenerating"
          @keydown.enter.ctrl="handleGenerate"
        />
        <div class="input-hint">按 Ctrl + Enter 快捷生成</div>
      </el-form-item>
      <div class="ai-tip-box" v-if="showDynamicDataTip">
        <el-icon><InfoFilled /></el-icon>
        <span>AI 会自动尝试使用已有变量或正则变量，如无法满足，请创建自定义变量后再编辑指令</span>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" :disabled="isGenerating">取 消</el-button>
        <el-button 
          type="primary" 
          :loading="isGenerating" 
          :disabled="models.length === 0 || !selectedModel"
          @click="handleGenerate"
        >
          {{ isGenerating ? '正在生成...' : '立即生成' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, Warning, InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: 'AI 生成'
  },
  placeholder: {
    type: String,
    default: '请输入描述...'
  },
  systemPrompt: {
    type: String,
    required: true
  },
  showDynamicDataTip: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const selectedModel = ref('')
const description = ref('')
const isGenerating = ref(false)
const models = ref<UtoolsAiModel[]>([])


watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const loading = ref(false)

const handleOpen = async () => {
  if (models.value.length === 0 && utools && typeof utools.ai === 'function') {
    loading.value = true
    try {
      const allModels = await utools.allAiModels()
      models.value = allModels || []
      if (models.value.length > 0 && !selectedModel.value) {
        selectedModel.value = models.value[0].id
      }
    } catch (e) {
      console.error('获取 AI 模型失败', e)
    } finally {
      loading.value = false
    }
  }
}

const handleGenerate = () => {
  if (!description.value) {
    ElMessage.warning('请输入描述内容')
    return
  }

  isGenerating.value = true
  let content = ''

  utools.ai({
    model: selectedModel.value,
    messages: [
      { role: 'system', content: props.systemPrompt },
      { role: 'user', content: description.value }
    ]
  }, (message: any) => {
    if (message.content) {
      content += message.content
    }
  }).then(() => {
    isGenerating.value = false
    emit('success', content)
    visible.value = false
    description.value = '' // 清空描述以便下次使用
  }).catch((err: any) => {
    isGenerating.value = false
    ElMessage.error('AI 生成失败：' + (err.message || err))
  })
}
</script>

<style scoped lang="scss">
  .w-full {
    width: 100%;
  }

  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px 20px;
    color: var(--el-text-color-secondary);
    
    .el-icon {
      font-size: 32px;
    }
    
    .hint {
      margin: 0;
      font-size: 12px;
      color: var(--el-text-color-placeholder);
    }
  }

  .loading-state {
    .el-icon {
      color: var(--el-color-primary);
    }
  }

  .empty-state {
    .el-icon {
      color: var(--el-color-warning);
    }
  }

  .input-hint {
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
  }

  .ai-tip-box {
    margin-top: 12px;
    padding: 10px 12px;
    background: var(--el-fill-color-lighter);
    border-radius: 6px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
    
    .el-icon {
      color: var(--el-color-info);
      font-size: 14px;
      flex-shrink: 0;
    }
    
    code {
      padding: 1px 4px;
      background: var(--el-color-primary-light-8);
      color: var(--el-color-primary);
      border-radius: 3px;
      font-family: 'Fira Code', monospace;
      font-size: 11px;
    }
  }
</style>
