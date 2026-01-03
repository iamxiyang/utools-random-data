<template>
  <transition name="fade-slide" appear>
    <div class="edit-page">
      <!-- 顶部导航栏 -->
      <header class="edit-header">
        <div class="header-left">
          <el-button text @click="router.back()" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <div class="header-divider"></div>
          <h1 class="page-title">{{ isEditing ? '编辑指令' : '创建指令' }}</h1>
        </div>
        <div class="header-right">
          <!-- AI 按钮已移到内容区域 -->
        </div>
      </header>

      <!-- 主体内容 -->
      <main class="edit-main">
        <div class="edit-content">
          <!-- 步骤 1: 基础配置 -->
          <section class="edit-section">
            <div class="section-badge">
              <span class="badge-num">1</span>
              <span class="badge-text">基础配置</span>
            </div>
            <div class="section-content">
              <div class="form-layout">
                <div class="form-group">
                  <label class="form-label required">
                    <el-icon><Operation /></el-icon>
                    <span>指令名称</span>
                  </label>
                  <div class="label-desc">用于在指令列表中展示，方便识别</div>
                  <el-input 
                    v-model="edit.explain" 
                    placeholder="如: 生成个人信息"
                    size="large"
                    class="styled-input"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">
                    <el-icon><Lightning /></el-icon>
                    <span>快捷启动</span>
                  </label>
                  <div class="label-desc">开启后可通过 uTools 搜索直接使用此指令</div>
                  <div class="switch-card">
                    <span class="switch-label">{{ edit.feature ? '已开启快捷搜索' : '已关闭快捷搜索' }}</span>
                    <el-switch v-model="edit.feature" />
                  </div>
                </div>
              </div>

              <!-- 唤醒词 - 仅在快捷启动开启时显示 -->
              <div class="form-group mt-20" v-if="edit.feature">
                <label class="form-label">
                  <el-icon><Promotion /></el-icon>
                  唤醒词
                  <el-tooltip content="在 uTools 输入框中输入这些词可以唤醒此指令">
                    <el-icon class="hint-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </label>
                <div class="tags-input-box">
                  <div class="tags-list">
                    <transition-group name="tag-pop">
                      <el-tag 
                        v-for="cmd in edit.cmds" 
                        :key="cmd" 
                        closable 
                        @close="delCmd(cmd)"
                        class="keyword-tag"
                        effect="plain"
                        type="primary"
                      >
                        {{ cmd }}
                      </el-tag>
                    </transition-group>
                    <div class="tag-input-area">
                      <el-input 
                        v-if="tagInputVisible" 
                        ref="tagInputRef" 
                        v-model="inputValue" 
                        size="small" 
                        class="tag-input"
                        placeholder="按回车添加"
                        @keyup.enter="tagInputConfrim" 
                        @blur="tagInputConfrim" 
                      />
                      <el-button 
                        v-else-if="edit.cmds.length < 5" 
                        size="small" 
                        text 
                        type="primary"
                        class="add-tag-btn" 
                        @click="tagInputVisible = true"
                      >
                        <el-icon><Plus /></el-icon>
                        添加唤醒词
                      </el-button>
                    </div>
                  </div>
                  <div class="tags-limit">{{ edit.cmds.length }}/5</div>
                </div>
              </div>
            </div>
          </section>

          <!-- 步骤 2: 指令内容 -->
          <section class="edit-section">
            <div class="section-badge">
              <span class="badge-num">2</span>
              <span class="badge-text">指令内容</span>
              <el-button 
                v-if="aiSupported" 
                @click="aiCreate" 
                size="small"
                class="section-ai-btn"
              >
                <el-icon class="mr-4px"><MagicStick /></el-icon>
                AI 智能生成
              </el-button>
            </div>
            <div class="section-content">
              <div class="content-tip-bar">
                <div class="tip-content">
                  <el-icon><EditPen /></el-icon>
                  <span>使用 <code>${变量名}</code> 格式插入变量，每次执行会生成不同的随机数据</span>
                </div>
                <el-select 
                  v-model="selectedVariable"
                  class="var-inserter" 
                  placeholder="快速插入变量" 
                  filterable 
                  size="small"
                  @change="addVariable"
                >
                  <template #prefix>
                    <el-icon><Cpu /></el-icon>
                  </template>
                  <el-option-group label="可用变量">
                    <el-option 
                      v-for="name in allVariablesName" 
                      :key="name" 
                      :label="name" 
                      :value="name"
                    >
                      <div class="var-option">
                        <span class="var-name">${{ name }}</span>
                        <el-icon class="var-icon"><Position /></el-icon>
                      </div>
                    </el-option>
                  </el-option-group>
                </el-select>
              </div>

              <div class="content-editor-wrapper">
                <el-input 
                  type="textarea" 
                  v-model="edit.content" 
                  :autosize="{ minRows: 10, maxRows: 20 }" 
                  placeholder="在这里输入模板内容，例如:&#10;{&#10;  &quot;name&quot;: &quot;${name}&quot;,&#10;  &quot;phone&quot;: &quot;${phone}&quot;,&#10;  &quot;email&quot;: &quot;${email}&quot;&#10;}"
                  @blur="blurEvent"
                  class="content-textarea"
                />
              </div>
            </div>
          </section>

          <!-- 步骤 3: 测试验证 -->
          <section class="edit-section" :class="{ 'has-results': testText.length > 0 }">
            <div class="section-badge">
              <span class="badge-num">3</span>
              <span class="badge-text">测试验证</span>
              <el-button 
                type="primary" 
                size="small" 
                @click="testCmd"
                class="test-action-btn"
              >
                <el-icon class="mr-4px"><CaretRight /></el-icon>
                执行测试
              </el-button>
            </div>
            <div class="section-content">
              <div v-if="testText.length === 0" class="test-placeholder">
                <el-icon class="placeholder-icon"><VideoPlay /></el-icon>
                <div class="placeholder-content">
                  <span class="placeholder-title">点击上方「执行测试」按钮</span>
                  <span class="placeholder-desc">查看生成的随机数据样例</span>
                </div>
              </div>
              <div v-else class="test-results">
                <div v-for="(text, index) in testText" :key="index" class="result-card">
                  <div class="result-header">
                    <span class="result-index">结果 #{{ index + 1 }}</span>
                    <el-button link type="primary" size="small" @click="copyText(text)">
                      <el-icon class="mr-2px"><CopyDocument /></el-icon>
                      复制
                    </el-button>
                  </div>
                  <pre class="result-content">{{ text }}</pre>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <!-- 底部操作栏 -->
      <footer class="edit-footer">
        <div class="footer-content">
          <el-button size="large" @click="router.back()" class="cancel-btn">取消</el-button>
          <el-button 
            type="primary" 
            size="large" 
            @click="saveCmd(ruleFormRef)"
            class="save-btn"
          >
            <el-icon class="mr-6px"><CircleCheck /></el-icon>
            保存指令
          </el-button>
        </div>
      </footer>

      <!-- AI 生成弹窗 -->
      <AiGenerateDialog
        v-model="aiDialogVisible"
        title="AI 生成指令内容"
        placeholder="例如：生成一个包含姓名、手机号和地址的 JSON 格式数据"
        :system-prompt="commandSystemPrompt"
        :show-dynamic-data-tip="true"
        @success="onAiSuccess"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { nextTick } from 'vue'
import cloneDeep from 'lodash.clonedeep'
  import AiGenerateDialog from '../../components/AiGenerateDialog.vue'
  import { ElInput, ElMessage, ElMessageBox, FormInstance } from 'element-plus'
  import { 
    ArrowLeft, MagicStick, Operation, Lightning, Promotion, 
    QuestionFilled, Plus, InfoFilled, Cpu, Position, 
    CaretRight, VideoPlay, CopyDocument, CircleCheck, EditPen 
  } from '@element-plus/icons-vue'
  import { runCmd } from '../../commands/parse'
  import { UUID } from '../../variables/modules/other'
  import { useAppStore } from '../../store/app.store'

  const appStore = useAppStore()
  const { commands, allVariablesName } = storeToRefs(appStore)

  const router = useRouter()

  const aiSupported = ref(!!(utools && typeof utools.ai === 'function'))

  const aiDialogVisible = ref(false)
  const commandSystemPrompt = computed(() => {
    const availableVars = allVariablesName.value.map(name => `\${${name}}`).join(', ')
    return `你是一个数据模板专家，正在为一个 uTools 随机数据生成插件编写指令。
指令内容包含普通文本和变量占位符（格式为 \${变量名}）。

当前插件已支持的变量有：${availableVars}。

【正则变量】如果上述变量不能满足需求，可以使用正则变量生成任意格式的随机数据：
格式：\${正则(/正则表达式/)}
常用示例：
• 6位数字验证码：\${正则(/[0-9]{6}/)}
• 随机密码：\${正则(/[a-zA-Z0-9!@#$%]{8,16}/)}
• 英文名：\${正则(/[A-Z][a-z]{2,8}/)}
• 100-999的数字：\${正则(/[1-9][0-9]{2}/)}
• 任意长度字母：\${正则(/[a-zA-Z]{5,10}/)}
• 订单号格式：\${正则(/ORD[0-9]{8}/)}
• 产品编码：\${正则(/[A-Z]{2}-[0-9]{4}/)}

请根据用户的描述，生成一段指令内容格式。
要求：
1. 优先使用上述列出的已支持变量。
2. 如果没有合适的内置变量，使用正则变量 \${正则(/pattern/)} 来生成。
3. 返回的内容应该是用户想要的格式（如 JSON、CSV、Markdown 或普通文本）。
4. 只返回指令内容，不要包含 markdown 代码块标记，不要包含任何解释说明。`
  })

  const aiCreate = () => {
    aiDialogVisible.value = true
  }

  const onAiSuccess = (aiContent: string) => {
    if (aiContent) {
      const cleanedContent = aiContent.replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/```$/, '').trim()
      edit.content = cleanedContent
      ElMessage.success('生成成功')
    }
  }

  const defaultEdit = () => {
    return {
      code: '',
      explain: '',
      cmds: [],
      content: '',
      feature: false,
    }
  }

  const id = ref('')
  const rev = ref('')
  const defaultData = defaultEdit()
  let edit = reactive<Commands>(defaultData)

  const isEditing = computed(() => id.value && !id.value.startsWith('cmd-'))

  onMounted(() => {
    const { id: queryId } = useRoute().query
    id.value = (queryId as string) || `cmd-${UUID()}`

    if (queryId) {
      const find: DbCommands | undefined = commands.value.find((item: DbCommands) => item._id === queryId)
      const data = find?.data
      if (data) {
        rev.value = find?._rev as string
        edit = Object.assign(edit, cloneDeep(data))
      }
    }
  })

  const inputValue = ref('')
  const tagInputVisible = ref(false)
  const tagInputRef = ref<InstanceType<typeof ElInput>>()

  const delCmd = (tag: string) => {
    edit.cmds.splice(edit.cmds.indexOf(tag), 1)
  }

  watchEffect(() => {
    if (tagInputVisible.value) {
      nextTick(() => {
        tagInputRef.value!.input!.focus()
      })
    }
  })

  const tagInputConfrim = () => {
    if (inputValue.value) {
      if (!edit.cmds.includes(inputValue.value)) {
        edit.cmds.push(inputValue.value)
      }
    }
    tagInputVisible.value = false
    inputValue.value = ''
  }

  const ruleFormRef = ref<FormInstance>()

  const blurIndex = ref(0)
  const selectedVariable = ref<string>()

  const blurEvent = (event: FocusEvent) => {
    blurIndex.value = (event?.target as HTMLInputElement)?.selectionStart || edit.content.length
  }

  const addVariable = (val: string) => {
    const start = edit.content.slice(0, blurIndex.value)
    const end = edit.content.slice(blurIndex.value)
    edit.content = `${start}\${${val}}${end}`
    blurIndex.value = blurIndex.value + val.length + 3
    // Reset selection to allow selecting the same variable again
    nextTick(() => {
      selectedVariable.value = undefined
    })
  }

  const testText = ref<string[]>([])

  const testCmd = () => {
    if (!edit.content) {
      ElMessage.warning('请先输入指令内容')
      return
    }
    const text = runCmd(edit.content)
    const text2 = runCmd(edit.content)
    testText.value = [String(text), String(text2)]
    ElMessage.success('测试完成')
  }

  const copyText = (text: string) => {
    if (utools && utools.copyText) {
      utools.copyText(text)
      ElMessage.success('已复制到剪贴板')
    }
  }

  const saveCmd = async (formEl: FormInstance | undefined) => {
    try {
      // 手动验证
      if (!edit.explain) {
        ElMessage.error('请输入指令名称')
        return
      }
      if (!edit.content) {
        ElMessage.error('请输入指令内容')
        return
      }
      if (edit.feature && (!edit.cmds || edit.cmds.length === 0)) {
        ElMessage.error('开启快捷启动时，唤醒词不能为空')
        return
      }

      // 强制校准 code 和 ID
      if (!edit.code) {
        edit.code = id.value
      }
      
      // 检查名称重复 (排除自身)
      for (let i = 0, len = commands.value.length; i < len; i++) {
        const item = commands.value[i]
        if (item && item.data) {
          if (item._id !== id.value && item.data.explain === edit.explain) {
            ElMessage.error('指令名称已存在，请更换一个')
            return
          }
        }
      }

      const index = commands.value.findIndex((item: any) => item._id === id.value)
      const saveData = {
        _id: id.value,
        _rev: rev.value || undefined,
        data: cloneDeep(toRaw(edit))
      }

      if (index >= 0) {
        commands.value.splice(index, 1, saveData)
      } else {
        commands.value.unshift(saveData)
      }

      ElMessage.success('保存成功')
      router.back()
    } catch (err) {
      console.error('Save failed:', err)
      ElMessage.error('保存失败')
    }
  }
</script>

<style scoped lang="scss">
  .edit-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--el-bg-color-page);
    overflow: hidden;
  }

  /* ===== 顶部导航栏 ===== */
  .edit-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-lighter);
    z-index: 100;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .back-btn {
    color: var(--el-text-color-regular);
    font-weight: 500;
    
    &:hover {
      color: var(--el-color-primary);
    }
  }

  .header-divider {
    width: 1px;
    height: 20px;
    background: var(--el-border-color);
  }

  .page-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .ai-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: #fff;
    font-weight: 500;
    
    &:hover {
      opacity: 0.9;
    }
  }

  /* ===== 主体内容 ===== */
  .edit-main {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .edit-content {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ===== 分步骤卡片 ===== */
  .edit-section {
    background: var(--el-bg-color);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-lighter);
    overflow: hidden;
    
    &.has-results .section-badge {
      background: var(--el-color-success-light-9);
      border-color: var(--el-color-success-light-7);
    }
  }

  .section-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--el-fill-color-lighter);
    border-bottom: 1px solid var(--el-border-color-extra-light);
  }

  .badge-num {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    font-size: 12px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--el-color-primary-light-7);
  }

  .badge-text {
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    flex: 1;
  }

  .test-action-btn {
    margin-left: auto;
  }

  .section-ai-btn {
    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
    border: none;
    color: #fff;
    padding: 0 16px;
    height: 32px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(124, 58, 237, 0.3);
      opacity: 0.95;
    }

    &:active {
      transform: translateY(0);
    }
  }

  .section-content {
    padding: 12px 16px;
  }

  /* ===== 表单样式 ===== */
  .form-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mt-20 {
    margin-top: 12px;
  }

  .form-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
    
    .el-icon {
      font-size: 16px;
      color: var(--el-color-primary);
    }
    
    &.required::after {
      content: '*';
      color: var(--el-color-danger);
      margin-left: 4px;
    }
  }

  .label-desc {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-bottom: 6px;
    line-height: 1.4;
  }

  .hint-icon {
    color: var(--el-text-color-placeholder) !important;
    cursor: help;
    font-size: 12px !important;
  }

  .styled-input {
    :deep(.el-input__wrapper) {
      border-radius: 8px;
      box-shadow: 0 0 0 1px var(--el-border-color) inset;
      
      &:hover {
        box-shadow: 0 0 0 1px var(--el-border-color-darker) inset;
      }
      
      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }
  }

  /* ===== 开关卡片 ===== */
  .switch-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--el-fill-color-lighter);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-extra-light);
  }

  .switch-label {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  /* ===== 标签输入 ===== */
  .tags-input-box {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    background: var(--el-fill-color-lighter);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-extra-light);
    min-height: 48px;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
    align-items: center;
  }

  .keyword-tag {
    border-radius: 16px;
    padding: 0 12px;
    height: 28px;
    font-weight: 500;
  }

  .tag-input-area {
    display: inline-flex;
  }

  .tag-input {
    width: 120px;
  }

  .add-tag-btn {
    padding: 4px 8px;
  }

  .tags-limit {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    flex-shrink: 0;
    padding-top: 4px;
  }

  /* ===== 指令内容编辑 ===== */
  .content-tip-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, var(--el-color-primary-light-9), var(--el-fill-color-lighter));
    border-radius: 8px;
    border: 1px solid var(--el-border-color-extra-light);
    flex-wrap: wrap;
    gap: 12px;
  }

  .tip-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--el-text-color-regular);
    
    .el-icon {
      font-size: 16px;
      color: var(--el-color-primary);
    }
    
    code {
      padding: 2px 6px;
      background: var(--el-color-primary-light-8);
      color: var(--el-color-primary);
      border-radius: 4px;
      font-family: 'Fira Code', monospace;
      font-size: 12px;
      font-weight: 500;
    }
  }

  .var-inserter {
    width: 180px;
  }

  .var-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .var-name {
    font-family: 'Fira Code', monospace;
    font-size: 13px;
  }

  .var-icon {
    color: var(--el-text-color-placeholder);
    font-size: 14px;
  }

  .content-editor-wrapper {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--el-border-color);
    background: var(--el-bg-color);
    transition: all 0.3s;
    
    &:focus-within {
      border-color: var(--el-color-primary);
      box-shadow: 0 0 0 2px var(--el-color-primary-light-8);
    }
  }

  .content-textarea {
    :deep(.el-textarea__inner) {
      border: none;
      box-shadow: none;
      background: transparent;
      font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
      font-size: 14px;
      line-height: 1.6;
      padding: 16px;
    }
  }

  /* ===== 测试验证 ===== */
  .test-placeholder {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 40px 20px;
  }

  .placeholder-icon {
    font-size: 40px;
    color: var(--el-text-color-placeholder);
    opacity: 0.5;
  }

  .placeholder-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .placeholder-title {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    font-weight: 500;
  }

  .placeholder-desc {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
  }

  .test-results {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }

  .result-card {
    background: var(--el-fill-color-extra-light);
    border-radius: 12px;
    border: 1px solid var(--el-border-color-lighter);
    overflow: hidden;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: var(--el-color-primary-light-5);
      background: var(--el-bg-color);
    }
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: var(--el-fill-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .result-index {
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .result-content {
    margin: 0;
    padding: 14px;
    font-family: 'Fira Code', monospace;
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-all;
    color: var(--el-text-color-regular);
    max-height: 200px;
    overflow-y: auto;
  }

  /* ===== 底部操作栏 ===== */
  .edit-footer {
    flex-shrink: 0;
    padding: 20px 24px;
    background: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-lighter);
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);
    z-index: 100;
  }

  .footer-content {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    gap: 16px;
  }

  .cancel-btn {
    border-radius: 10px;
    font-weight: 500;
  }

  .save-btn {
    border-radius: 10px;
    padding-left: 24px;
    padding-right: 24px;
    font-weight: 600;
    box-shadow: 0 4px 12px var(--el-color-primary-light-7);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px var(--el-color-primary-light-5);
    }
  }

  /* ===== 过渡动画 ===== */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.3s ease;
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .tag-pop-enter-active,
  .tag-pop-leave-active {
    transition: all 0.25s ease;
  }

  .tag-pop-enter-from,
  .tag-pop-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
</style>
