<!--创建和编辑指令-->
<template>
  <el-page-header class="m-y-20px" content="编辑指令" @back="router.back()" />
  <el-form label-position="top" ref="ruleFormRef" :model="edit" :rules="formRules">
    <el-form-item prop="explain" label="功能名称">
      <el-input v-model="edit.explain"></el-input>
    </el-form-item>
    <el-form-item prop="cmds" label="响应词，uTools输入框可直接使用">
      <el-tag v-for="cmd in edit.cmds" :key="cmd" :disable-transitions="false" closable @close="delCmd(cmd)">
        {{ cmd }}
      </el-tag>
      <el-input class="tag-input" v-if="tagInputVisible" ref="tagInputRef" v-model="inputValue" size="small" @keyup.enter="tagInputConfrim" @blur="tagInputConfrim"> </el-input>
      <el-button v-else-if="edit.cmds.length < 5" size="small" @click="tagInputVisible = true"> + 新唤醒词 </el-button>
    </el-form-item>
    <el-form-item prop="feature" label="快捷启动">
      <el-tooltip class="box-item" effect="dark" content="开启后可通过uTools搜索框直接键入指令名使用" placement="top-start">
        <el-switch v-model="edit.feature"></el-switch>
      </el-tooltip>
    </el-form-item>
    <el-form-item required prop="content" label="指令内容">
      <el-input type="textarea" v-model="edit.content" :autosize="{ minRows: 6, maxRows: 16 }" @blur="blurEvent"></el-input>
      <div class="m-y-20px w-180px">
        <el-select placeholder="插入变量" filterable @change="addVariable">
          <el-option v-for="name in allVariablesName" :key="name" :label="name" :value="name"></el-option>
        </el-select>
      </div>
    </el-form-item>
  </el-form>
  <div class="m-y-20px flex items-center justify-end">
    <el-button @click="testCmd">测 试</el-button>
    <el-button type="primary" @click="saveCmd(ruleFormRef)">保 存</el-button>
  </div>

  <el-dialog v-model="dialogTest" title="测试结果" width="60vw">
    <div>
      <el-alert title="以下是根据你的指令内容随机生成的2条内容，如果觉得不符合预期可修改后重新测试" type="info" />
      <div class="m-t-40px p-b-10px">
        <template v-for="(text, index) in testText" :key="text">
          <p class="m-0 break-words" style="white-space: pre-wrap">{{ text }}</p>
          <el-divider v-if="index < testText.length - 1" />
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import cloneDeep from 'lodash.clonedeep'
  import { ElInput, ElMessage, FormInstance } from 'element-plus'
  import { runCmd } from '../../commands/parse'
  import { UUID } from '../../variables/modules/other'
  import { useAppStore } from '../../store/app.store'

  const appStore = useAppStore()
  const { commands, allVariablesName } = storeToRefs(appStore)

  const router = useRouter()

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

  // 初始化数据
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

  // 自定义唤醒词
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
      edit.cmds.push(inputValue.value)
    }
    tagInputVisible.value = false
    inputValue.value = ''
  }

  // 内容效验
  const ruleFormRef = ref<FormInstance>()
  const validatePass = (rule: any, value: any, callback: any) => {
    if ((!value || value.length === 0) && edit.feature) {
      callback(new Error('快捷启动时唤醒词不能为空'))
    } else {
      callback()
    }
  }

  const formRules = reactive({
    cmds: [{ trigger: 'blur', validator: validatePass }],
    content: [{ trigger: 'blur', required: true, message: '指令内容必须填写' }],
    explain: [{ trigger: 'blur', required: true, message: '指令名称必须填写' }],
  })

  const blurIndex = ref(0)

  const blurEvent = (event: FocusEvent) => {
    blurIndex.value = (event?.target as HTMLInputElement)?.selectionStart || edit.content.length
  }

  const addVariable = (val: string) => {
    const start = edit.content.slice(0, blurIndex.value)
    const end = edit.content.slice(blurIndex.value)
    edit.content = `${start}\${${val}}${end}`
    blurIndex.value = blurIndex.value + val.length + '\${}'.length
  }

  // 数据测试
  let dialogTest = ref(false)
  let testText = ref<string[] | number[]>([])

  const testCmd = () => {
    const text = runCmd(edit.content)
    const text2 = runCmd(edit.content)
    testText.value = [text, text2]
    dialogTest.value = true
  }

  // 保存指令
  const saveCmd = async (formEl: FormInstance | undefined) => {
    try {
      if (!formEl) return
      await formEl.validate()
      // 判断功能名称不能重复
      for (let i = 0, len = commands.value.length; i < len; i++) {
        const _id = commands.value[i]._id
        const { explain } = commands.value[i].data
        if (_id !== id.value && explain === edit.explain) {
          ElMessage.error('功能名称已存在，不能重复')
          break
        }
      }
      if (!edit.code) {
        edit.code = id.value
      }
      const index = commands.value.findIndex((item: DbDoc) => item._id === id.value)
      if (index >= 0) {
        commands.value.splice(index, 1, {
          _id: id.value,
          _rev: rev.value,
          data: toRaw(edit),
        })
      } else {
        commands.value.unshift({
          _id: id.value,
          _rev: rev.value,
          data: toRaw(edit),
        })
      }
      ElMessage({
        message: '已保存',
        type: 'success',
        center: true,
      })
      setTimeout(() => {
        router.back()
      }, 800)
    } catch (err) {
      ElMessage({
        message: '信息填写不完整',
        type: 'warning',
        center: true,
      })
    }
  }
</script>

<style scoped lang="scss">
  :deep(.el-tag),
  :deep(.el-button),
  :deep(.tag-input) {
    margin-right: 14px;
  }

  .tag-input {
    display: inline-block;
    width: 100px;
  }
</style>
