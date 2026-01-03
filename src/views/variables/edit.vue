<template>
  <transition name="fade-slide" appear>
    <div class="edit-page">
      <!-- 顶部导航栏 -->
      <header class="edit-header">
        <div class="header-left">
          <el-button text @click="$router.back()" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <div class="header-divider"></div>
          <h1 class="page-title">{{ rev ? '编辑变量' : '创建变量' }}</h1>
        </div>
        <div class="header-right">
          <!-- AI 按钮已移到内容区域 -->
        </div>
      </header>

      <!-- 主体内容 -->
      <main class="edit-main">
        <div class="edit-content">
          <!-- 步骤 1: 基础信息 -->
          <section class="edit-section">
            <div class="section-badge">
              <span class="badge-num">1</span>
              <span class="badge-text">基础信息</span>
            </div>
            <div class="section-content">
              <div class="form-layout">
                <div class="form-group">
                  <label class="form-label required">
                    <el-icon><Key /></el-icon>
                    <span>变量名称</span>
                  </label>
                  <div class="label-desc">仅支持中英文和数字，不可重复</div>
                  <el-input 
                    v-model.trim="edit.name" 
                    placeholder="如: randomMobile"
                    size="large"
                    class="styled-input name-input"
                  >
                    <template #prefix>
                      <span class="input-symbol">${</span>
                    </template>
                    <template #suffix>
                      <span class="input-symbol">}</span>
                    </template>
                  </el-input>
                </div>
                
                <div class="form-group">
                  <label class="form-label">
                    <el-icon><Document /></el-icon>
                    <span>功能描述</span>
                  </label>
                  <div class="label-desc">用于在变量列表中展示，帮助您快速识别变量作用</div>
                  <el-input 
                    v-model.trim="edit.explain" 
                    placeholder="简要说明这个变量的作用"
                    size="large"
                    class="styled-input"
                  />
                </div>
              </div>
            </div>
          </section>

          <!-- 步骤 2: 变量逻辑 -->
          <section class="edit-section">
            <div class="section-badge">
              <span class="badge-num">2</span>
              <span class="badge-text">变量逻辑</span>
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
              <div class="editor-tip-bar">
                <div class="tip-content">
                  <el-icon><EditPen /></el-icon>
                  <span>直接编写 <code>JavaScript</code> 代码，使用 <code>return</code> 返回结果</span>
                </div>
                <el-link 
                  type="primary" 
                  :underline="false" 
                  @click="openUrl(GIT_STRING_VARIABLES_URL)"
                  class="doc-link"
                >
                  <el-icon class="mr-4px"><Link /></el-icon>
                  查看示例代码
                </el-link>
              </div>
              <div class="code-editor-wrapper">
                <div class="editor-toolbar">
                  <div class="toolbar-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                  </div>
                  <div class="toolbar-filename">index.js</div>
                </div>
                <div ref="editorRef" class="code-editor"></div>
                <!-- 实时预览 -->
                <div class="inline-preview">
                  <div class="preview-label">
                    <el-icon><View /></el-icon>
                    <span>预览结果</span>
                    <el-tag v-if="resultError" type="danger" size="small" effect="light">出错</el-tag>
                  </div>
                  <div class="preview-content">
                    <code v-if="resultError" class="preview-error">{{ resultError }}</code>
                    <code v-else-if="result" class="preview-result">{{ result }}</code>
                    <span v-else class="preview-placeholder">编写代码后自动显示结果...</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <!-- 底部操作栏 -->
      <footer class="edit-footer">
        <div class="footer-content">
          <el-button size="large" @click="$router.back()" class="cancel-btn">取消</el-button>
          <el-button type="primary" size="large" @click="saveVars" class="save-btn">
            <el-icon class="mr-6px"><CircleCheck /></el-icon>
            保存变量
          </el-button>
        </div>
      </footer>

      <!-- AI 生成弹窗 -->
      <AiGenerateDialog
        v-model="aiDialogVisible"
        title="AI 生成变量代码"
        placeholder="例如：生成一个随机的中国手机号，支持号段 134-139"
        :system-prompt="variableSystemPrompt"
        @success="onAiSuccess"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
  import * as monaco from 'monaco-editor'
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
  import { useDark } from '@vueuse/core'
  import { openUrl } from '../../utils'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { 
    ArrowLeft, MagicStick, Key, Document, Link, View, 
    CircleCheck, Connection, WarningFilled, Monitor, InfoFilled, EditPen 
  } from '@element-plus/icons-vue'
  import { evaluate } from '../../utils/variable'
  import { useAppStore } from '../../store/app.store'
  import cloneDeep from 'lodash.clonedeep'
  import AiGenerateDialog from '../../components/AiGenerateDialog.vue'

  const router = useRouter()
  const appStore = useAppStore()
  const { variables, systemVariables } = storeToRefs(appStore)

  const id = ref(`var-${Date.now()}`)
  const rev = ref('')
  const edit = reactive<Variables>({
    name: '',
    code: '',
    explain: '',
  })

  const GIT_STRING_VARIABLES_URL = 'https://github.com/iamxiyang/utools-random-data/blob/main/src/variables/string.default.ts'

  let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null
  const aiSupported = ref(!!(utools && typeof utools.ai === 'function'))

  const aiDialogVisible = ref(false)
  const variableSystemPrompt = `你是一个专业的 JavaScript 开发者，正在为一个 uTools 随机数据生成插件编写自定义变量。
请根据用户的描述，生成一段完整的 JavaScript 函数体代码。
要求：
1. 代码会在 new Function 中执行，请直接编写逻辑并使用 return 返回结果。
2. 环境支持内置工具库及其版本：
   - _dayjs (v1.11.19, 日期处理)
   - _random (v3.2.0, lodash 生成随机数)
   - _sample (v4.2.1, lodash 从数组随机取样)
   - _times (v4.3.2, lodash 循环)
   - _clonedeep (v4.5.0, lodash 深拷贝)
   - _isequal (v4.5.0, lodash 相等判断)
3. 只返回代码内容，不要包含 markdown 代码块标记，不要包含任何解释说明。
4. 确保生成的代码可以产生用户描述的随机数据。`

  const aiCreate = () => {
    aiDialogVisible.value = true
  }

  const onAiSuccess = (aiCode: string) => {
    if (aiCode) {
      const cleanedCode = aiCode.replace(/^```javascript\n?/, '').replace(/^```js\n?/, '').replace(/```$/, '').trim()
      edit.code = cleanedCode
      if (editorInstance) {
        editorInstance.setValue(cleanedCode)
      }
      ElMessage.success('生成成功')
    }
  }

  let timer: any = null
  const result = ref('')
  const resultError = ref('')

  const isDark = useDark({
    onChanged(isDark) {
      monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs')
    },
  })

  self.MonacoEnvironment = {
    createTrustedTypesPolicy: () => undefined,
    getWorker: function (_workerId: string, label: string) {
      switch (label) {
        case 'typescript':
        case 'javascript':
          return new tsWorker()
        default:
          return new editorWorker()
      }
    },
  }

  const editorRef = ref<HTMLElement>()

  watch(editorRef, () => {
    if (!editorRef.value) return
    const editor = monaco.editor.create(editorRef.value, {
      value: edit.code || '',
      language: 'javascript',
      theme: isDark.value ? 'vs-dark' : 'vs',
      tabSize: 2,
      automaticLayout: true,
      minimap: { enabled: false },
      contextmenu: false,
      scrollBeyondLastLine: false,
      formatOnPaste: true,
      formatOnType: true,
      folding: true,
      lineNumbersMinChars: 3,
      fontFamily: '"Fira Code", "Cascadia Code", Consolas, Monaco, "Courier New", monospace',
      fontSize: 13,
      lineHeight: 20,
      renderLineHighlight: 'all',
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      roundedSelection: true,
    })

    // @ts-ignore
    editor.getContribution('editor.linkDetector').openerService._defaultExternalOpener.openExternal = function (url: string) {
      openUrl(url)
    }

    editorInstance = editor

    editor.onDidChangeModelContent(() => {
      const code = editor.getValue()
      edit.code = code
      clearTimeout(timer)
      timer = setTimeout(() => {
        try {
          resultError.value = ''
          result.value = evaluate(code, true)
        } catch (err: any) {
          result.value = ''
          resultError.value = err?.message || String(err)
        }
      }, 500)
    })
  })

  const saveVars = async () => {
    if (!edit.name) {
      ElMessage.error('请输入变量名称')
      return
    }
    if (!edit.code) {
      ElMessage.error('请输入变量代码')
      return
    }

    const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
    if (!reg.test(edit.name)) {
      ElMessage.error('变量名称只能是中文、英文和数字')
      return
    }

    const isExist = systemVariables.value.find((item) => item.name === edit.name)
    if (isExist) {
      ElMessage.error('变量名称不能和内置变量相同，请更换名称')
      return
    }

    const isExist2 = variables.value.filter((item) => item.data && item.data.name === edit.name && (!rev.value || item._id !== id.value))
    if (isExist2.length) {
      ElMessage.error('变量名称不能和已有变量相同，请更换名称')
      return
    }

    if (rev.value) {
      const variable = variables.value.find((item) => item._id === id.value)
      if (variable && variable.data.name !== edit.name) {
        await ElMessageBox.confirm('检测到修改了变量名称，如果指令中使用了当前变量，你需要手动修改使用到的地方才能正常工作', '确认修改', {
          confirmButtonText: '确定修改',
          cancelButtonText: '我再想想',
          type: 'warning'
        })
      }
    }

    let strArr = []
    for (let i = 0; i < 2; i++) {
      try {
        strArr.push(evaluate(edit.code, true))
      } catch (err) {
        ElMessageBox.alert('代码执行出错，请检查你写的代码，并确保测试通过后再保存', '逻辑错误', { type: 'error' })
        return
      }
    }

    await ElMessageBox.confirm(
      `<strong>请确认测试结果符合预期</strong><br><br><div class="confirm-result-list">${strArr.map(s => `<span>${s}</span>`).join('')}</div>`,
      '确认保存',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定保存',
        cancelButtonText: '返回修改',
      }
    )

    try {
      const data = cloneDeep({
        name: edit.name,
        code: edit.code,
        explain: edit.explain,
      })
      const index = variables.value.findIndex((item: DbDoc) => item._id === id.value)

      if (index >= 0) {
        variables.value.splice(index, 1, {
          _id: id.value,
          _rev: rev.value,
          data,
        })
      } else {
        variables.value.unshift({
          _id: id.value,
          _rev: rev.value,
          data,
        })
      }

      ElMessage.success('保存成功')

      router.back()
    } catch (err) {
      ElMessageBox.alert('保存失败: ' + err, '错误', { type: 'error' })
    }
  }

  onMounted(() => {
    const { id: queryId } = useRoute().query

    if (queryId) {
      id.value = queryId as string
      const variable = variables.value.find((item) => item._id === queryId)
      if (variable) {
        rev.value = variable?._rev as string
        edit.name = variable.data.name
        edit.code = variable.data.code
        edit.explain = variable.data.explain
        try {
          result.value = evaluate(variable.data.code)
        } catch (e: any) {
          resultError.value = e?.message || String(e)
        }
      }
    }
  })
</script>

<style lang="scss" scoped>
  @import 'monaco-editor/min/vs/editor/editor.main.css';

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
    
    &.compact {
      .section-content {
        padding: 12px 16px;
      }
    }
  }

  .section-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--el-fill-color-extra-light);
    border-bottom: 1px solid var(--el-border-color-lighter);
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

  .name-input {
    max-width: 400px;
    
    :deep(.el-input__inner) {
      font-weight: 600;
      color: var(--el-color-primary);
      letter-spacing: 0.5px;
    }
  }

  .input-symbol {
    color: var(--el-color-primary);
    font-family: 'Fira Code', monospace;
    font-size: 16px;
    font-weight: 700;
    opacity: 0.7;
    padding: 0 4px;
  }

  /* ===== 代码编辑器 ===== */
  .editor-tip-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    margin-bottom: 12px;
    background: linear-gradient(135deg, var(--el-color-primary-light-9), var(--el-fill-color-lighter));
    border-radius: 8px;
    border: 1px solid var(--el-border-color-extra-light);
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

  .doc-link {
    font-size: 12px;
    font-weight: 500;
  }

  .code-editor-wrapper {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--el-border-color-darker);
    background: #1e1e1e;
  }

  .editor-toolbar {
    height: 36px;
    background: #2d2d2d;
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 12px;
  }

  .toolbar-dots {
    display: flex;
    gap: 6px;
    
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      
      &.red { background: #ff5f56; }
      &.yellow { background: #ffbd2e; }
      &.green { background: #27c93f; }
    }
  }

  .toolbar-filename {
    font-family: 'Fira Code', monospace;
    font-size: 12px;
    color: #9cdcfe;
    opacity: 0.8;
  }

  .code-editor {
    height: 220px;
  }

  /* ===== 内联预览 ===== */
  .inline-preview {
    background: #2d2d2d;
    border-top: 1px solid #404040;
    padding: 12px 16px;
    
    .preview-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #9cdcfe;
      margin-bottom: 8px;
      
      .el-icon {
        font-size: 14px;
      }
      
      .el-tag {
        margin-left: auto;
      }
    }
    
    .preview-content {
      font-family: 'Fira Code', 'Consolas', monospace;
      font-size: 13px;
      line-height: 1.5;
      min-height: 24px;
      word-break: break-all;
      white-space: pre-wrap;
    }
    
    .preview-result {
      color: #4ec9b0;
    }
    
    .preview-error {
      color: #f48771;
    }
    
    .preview-placeholder {
      color: #6a9955;
      font-style: italic;
    }
  }

  /* ===== 预览与选项 ===== */
  .preview-options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .preview-card, .options-card {
    background: var(--el-fill-color-extra-light);
    border-radius: 8px;
    border: 1px solid var(--el-border-color-lighter);
    overflow: hidden;
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--el-fill-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .preview-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    
    .el-icon {
      color: var(--el-color-primary);
    }
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    display: inline-block;
    margin-right: 4px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .preview-body {
    padding: 12px;
    min-height: 48px;
    display: flex;
    align-items: center;
  }

  .preview-result {
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    color: var(--el-color-success);
    word-break: break-all;
    white-space: pre-wrap;
    line-height: 1.5;
  }

  .preview-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    color: var(--el-color-danger);
    font-size: 13px;
    
    .el-icon {
      margin-top: 2px;
      flex-shrink: 0;
    }
    
    code {
      font-family: 'Fira Code', monospace;
      word-break: break-all;
    }
  }

  .preview-empty {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 8px 0;
    
    .el-icon {
      font-size: 28px;
      color: var(--el-text-color-placeholder);
      opacity: 0.6;
    }
    
    .empty-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      
      span {
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
      
      .empty-sub {
        font-size: 11px;
        color: var(--el-text-color-placeholder);
      }
    }
  }

  .option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
  }

  .option-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .option-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    
    .el-icon {
      color: var(--el-color-primary);
    }
  }

  .option-desc {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  /* ===== 底部操作栏 ===== */
  .edit-footer {
    flex-shrink: 0;
    padding: 12px 16px;
    background: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color-lighter);
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
    border-radius: 8px;
    padding-left: 20px;
    padding-right: 20px;
    font-weight: 600;
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

  /* ===== 确认弹窗样式 ===== */
  :deep(.confirm-result-list) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    span {
      padding: 10px 14px;
      background: var(--el-fill-color);
      border-radius: 6px;
      font-family: 'Fira Code', monospace;
      border-left: 3px solid var(--el-color-primary);
      font-size: 13px;
    }
  }
</style>
