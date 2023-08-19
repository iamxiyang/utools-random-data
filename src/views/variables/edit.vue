<template>
  <el-page-header class="m-y-20px" content="编辑变量" @back="$router.back()" />

  <el-alert title="自定义变量属于测试阶段, 需要有一定的 JavaScript 基础, 同时可能不稳定或做出重大修改" type="warning" show-icon />

  <el-form label-position="top" :model="edit" class="my-4">
    <el-form-item prop="name">
      <template #label>
        <div class="flex items-center">
          <span class="mr-10px">变量名称</span>
          <el-popover placement="right" title="变量名称" :width="300" trigger="hover" :content="`变量名称不可重复，且只支持中文和英文，指令内容中需要通过 ${edit.name ? `\${${edit.name}}` : '变量名称'} 调用`">
            <template #reference>
              <el-icon><QuestionFilled /></el-icon>
            </template>
          </el-popover>
        </div>
      </template>
      <el-input v-model.trim="edit.name"></el-input>
    </el-form-item>
    <el-form-item prop="explain">
      <template #label>
        <div class="flex items-center">
          <span class="mr-10px">功能描述</span>
          <el-popover placement="right" title="功能描述" :width="300" trigger="hover" content="在变量列表显示变量的功能描述">
            <template #reference>
              <el-icon><QuestionFilled /></el-icon>
            </template>
          </el-popover>
        </div>
      </template>
      <el-input v-model.trim="edit.explain"></el-input>
    </el-form-item>
    <el-form-item prop="code">
      <template #label>
        <div class="flex items-center">
          <span class="mr-10px">变量代码</span>
          <el-popover placement="right" title="变量代码" :width="300" trigger="hover">
            <template #reference>
              <el-icon><QuestionFilled /></el-icon>
            </template>
            <p>只支持使用 JavaScript 代码</p>
            <el-text type="primary" class="cursor-pointer" @click="openUrl(GIT_STRING_VARIABLES_URL)"> 点击访问使用示例：{{ GIT_STRING_VARIABLES_URL }} </el-text>
          </el-popover>
        </div>
      </template>
      <div ref="editorRef" class="editor"></div>
    </el-form-item>
    <el-form-item prop="code2">
      <template #label>
        <div class="flex items-center">
          <span class="mr-10px">输出结果</span>
          <el-popover placement="right" title="输出结果" :width="300" trigger="hover" content="请根据输出结果判断是否符合，如果不符合预期请修改，报错情况下不支持保存">
            <template #reference>
              <el-icon><QuestionFilled /></el-icon>
            </template>
          </el-popover>
        </div>
      </template>
      <div class="result !dark:bg-#1e1e1e">
        <p class="m-0">{{ result || ' 无结果 ' }}</p>
      </div>
    </el-form-item>
  </el-form>

  <div class="m-y-20px flex items-center justify-end">
    <el-button type="primary" @click="saveVars()">保 存</el-button>
  </div>
</template>

<script setup lang="ts">
  import * as monaco from 'monaco-editor'
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
  import { useDark } from '@vueuse/core'
  import { openUrl } from '../../utils'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import { evaluate } from '../../utils/variable'
  import { useAppStore } from '../../store/app.store'
  import cloneDeep from 'lodash.clonedeep'

  const router = useRouter()
  const appStore = useAppStore()
  const { variables, systemVariables, } = storeToRefs(appStore)

  const id = ref(`var-${Date.now()}`)
  const rev = ref('')
  const edit = reactive<Variables>({
    name: '',
    code: '',
    explain: '',
  })

  const GIT_STRING_VARIABLES_URL = 'https://github.com/iamxiyang/utools-random-data/blob/main/src/variables/string.default.ts'

  // 编辑器
  let timer: any = null
  const result = ref('')

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

  const defaultEditorValue = `// 使用参考：${GIT_STRING_VARIABLES_URL} `

  watch(editorRef, () => {
    if (!editorRef.value) return
    const editor = monaco.editor.create(editorRef.value, {
      // 编辑时 value 是 db 取值
      value: edit.code || defaultEditorValue,
      language: 'javascript',
      theme: isDark.value ? 'vs-dark' : 'vs',
      tabSize: 2,
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
      contextmenu: false,
      scrollBeyondLastLine: false,
      formatOnPaste: true,
      formatOnType: true,
      folding: true,
      lineNumbersMinChars: 3,
    })

    // @ts-ignore
    editor.getContribution('editor.linkDetector').openerService._defaultExternalOpener.openExternal = function (url: string) {
      openUrl(url)
    }

    // 监听编辑器内容变化
    // 数据变化，2秒后执行获取结果，如果还发生变化，清空定时器，以最后一次为准
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue()
      edit.code = code
      clearTimeout(timer)
      timer = setTimeout(() => {
        try {
          result.value = evaluate(code, true)
        } catch (err: any) {
          result.value = err
        }
      }, 2000)
    })
  })

  const saveVars = async () => {
    // 检测是否填写完整
    if (!edit.name) {
      ElMessage.error('请输入变量名称')
      return
    }
    if (!edit.code) {
      ElMessage.error('请输入变量代码')
      return
    }

    // 变量名字只能是 中文、英文和数字，不能出现 符号
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

    const isExist2 = variables.value.filter((item) => item.data.name === edit.name && (!rev.value || item._id !== id.value))
    if (isExist2.length) {
      ElMessage.error('变量名称不能和已有变量相同，请更换名称')
      return
    }

    // 检查名称是否变化，名称变化以使用的需要手动修改
    if (rev.value) {
      const variable = variables.value.find((item) => item._id === id.value)
      if (variable && variable.data.name !== edit.name) {
        await ElMessageBox.confirm('', {
          message: `检测到修改了变量名称，如果指令中使用了当前变量，你需要手动修改使用到的地方才能正常工作`,
        })
      }
    }
    // 生成2条数据，如果生成错误告知错误不允许保存
    let strArr = []
    for (let i = 0; i < 2; i++) {
      try {
        strArr.push(evaluate(edit.code, true))
      } catch (err) {
        ElMessageBox.alert('确认', {
          message: '代码执行出错，请检查你写的代码，并确保测试通过后再保存',
        })
        return
      }
    }
    // 询问数据是否符合规则，再次告知使用方式
    await ElMessageBox.confirm('', {
      message: `<strong>请确认测试结果符合预期，你需要对自己写的代码负责，如果代码执行出错将会导致插件无法正常使用</strong><br><br>${strArr.join('<br>')}`,
      dangerouslyUseHTMLString: true,
    })
    // 保存数据，返回上一级页面
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

      ElMessage.success('保存成功，可以在评论区和大家分享哦~')
      router.back()
    } catch (err) {
      ElMessageBox.alert('确认', {
        message: '代码执行出错，请检查你写的代码，并确保测试通过后再保存' + err,
      })
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
        result.value = evaluate(variable.data.code)
      }
    } else {
      ElMessageBox.alert('自定义变量可以通过 JavaScript 实现特殊的随机规则，但目前尚属于测试阶段，可能不稳定或做出重大修改，欢迎反馈你的使用体验', '提示')
    }
  })
</script>

<style lang="scss" scoped>
  @import 'monaco-editor/min/vs/editor/editor.main.css';
  .editor {
    width: 100%;
    height: 200px;
  }
  .result {
    width: 100%;
    padding: 4px 10px;
    font-size: 14px;
    background-color: #f2f2f2;
  }
</style>
