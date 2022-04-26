<!--创建和编辑指令-->
<template>
  <el-page-header class="m-y-20" :icon="ArrowLeft" content="编辑指令" @back="router.back()" />
  <el-form label-position="top" ref="ruleFormRef" :model="edit" :rules="formRules">
    <el-form-item prop="explain" label="功能名称">
      <el-input v-model="edit.explain"></el-input>
    </el-form-item>
    <el-form-item prop="cmds" label="响应词，uTools输入框用来快捷生成">
      <el-tag v-for="cmd in edit.cmds" :key="cmd" :disable-transitions="false" closable @close="delCmd(cmd)">
        {{ cmd }}
      </el-tag>
      <el-input class="tag-input" v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm"> </el-input>
      <el-button v-else-if="edit.cmds.length < 5" size="small" @click="showInput"> + 新唤醒词 </el-button>
    </el-form-item>
    <el-form-item prop="feature" label="快捷启动">
      <el-tooltip class="box-item" effect="dark" content="开启后可通过uTools搜索框直接键入指令名使用" placement="top-start">
        <el-switch v-model="edit.feature"></el-switch>
      </el-tooltip>
    </el-form-item>
    <el-form-item required prop="content" label="指令内容">
      <el-input type="textarea" v-model="edit.content" :autosize="{ minRows: 6, maxRows: 16 }"></el-input>
      <div class="m-y-20">
        <el-select placeholder="插入变量" filterable @change="addVariable">
          <el-option v-for="item in _variable" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </div>
    </el-form-item>
  </el-form>
  <div class="m-y-20 footer">
    <el-button @click="testCmd">测 试</el-button>
    <el-button type="primary" @click="saveCmd(ruleFormRef)">保 存</el-button>
  </div>

  <el-dialog v-model="dialogTest" title="测试结果" width="60vw">
    <div>
      <el-alert title="以下是根据你的指令内容随机生成的2条内容，如果觉得不符合预期可修改后重新测试" type="info" />
      <div class="m-t-40 p-b-10">
        <template v-for="(text, index) in testText" :key="text">
          <p class="m-0">{{ text }}</p>
          <el-divider v-if="index < testText.length - 1" />
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import router from '../router'
  import { ArrowLeft } from '@element-plus/icons-vue'
  import { nextTick, reactive, computed, ref, onMounted, toRaw } from 'vue'
  import { ElForm, ElInput, ElMessage } from 'element-plus'
  import { useRoute } from 'vue-router'
  import variable from '../constant/variable'
  import { runCmd } from '../utils/random'
  import { uuid } from '../random'
  import { storeToRefs } from 'pinia'
  import useAppStore from '../store/index'
  import { cloneDeep } from 'lodash'
  export type ElFormInstance = InstanceType<typeof ElForm>
  // TODO 当前页面响应比较慢，需要优化

  const appStore = useAppStore()
  const { features } = storeToRefs(appStore)

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
  let edit = reactive<Feature>(defaultData)
  let originEdit = reactive<Feature>(cloneDeep(defaultData))

  const dialogTest = ref(false)
  const testText = ref<string[] | number[]>([])

  const _variable = computed(() => {
    return Object.keys(variable).map((key) => {
      return {
        name: key,
        example: variable[key].example,
        description: variable[key].description,
      }
    })
  })

  onMounted(() => {
    const { id: queryId } = useRoute().query
    id.value = (queryId as string) || `cmd-${uuid()}`

    if (queryId) {
      // @ts-ignore
      const find = features.value.find((item: any) => item._id === queryId)
      const data = find?.data
      if (data) {
        rev.value = find?._rev as string
        edit = Object.assign(edit, cloneDeep(data))
        originEdit = Object.assign(originEdit, cloneDeep(data))
      }
    }
  })

  const ruleFormRef = ref<ElFormInstance>()

  // 效验
  const validatePass = (rule: any, value: any, callback: any) => {
    if ((!value || value.length === 0) && edit.feature) {
      callback(new Error('快捷启动时唤醒词不能为空'))
    } else {
      callback()
    }
  }

  const formRules: any = reactive({
    cmds: [{ trigger: 'blur', validator: validatePass }],
    content: [{ trigger: 'blur', required: true, message: '指令内容必须填写' }],
    explain: [{ trigger: 'blur', required: true, message: '指令名称必须填写' }],
  })

  let inputValue = $ref('')
  let inputVisible = $ref(false)
  let InputRef = $ref<InstanceType<typeof ElInput>>()

  const showInput = () => {
    inputVisible = true
    nextTick(() => {
      InputRef!.input!.focus()
    })
  }

  const handleInputConfirm = () => {
    if (inputValue) {
      edit.cmds.push(inputValue)
    }
    inputVisible = false
    inputValue = ''
  }

  // 添加变量
  const addVariable = (val: string) => {
    edit.content = edit.content + val
  }

  const delCmd = (tag: string) => {
    edit.cmds.splice(edit.cmds.indexOf(tag), 1)
  }

  // 进行指令测试
  const testCmd = () => {
    const text = runCmd(edit.content)
    const text2 = runCmd(edit.content)
    testText.value = [text, text2]
    dialogTest.value = true
  }

  // 保存指令
  const saveCmd = async (formEl: ElFormInstance | undefined) => {
    try {
      if (!formEl) return
      await formEl.validate()
      // 判断功能名称和响应词不能重复
      for (let i = 0, len = features.value.length; i < len; i++) {
        const _id = features.value[i]._id
        const { explain, cmds } = features.value[i].data
        if (_id !== id.value) {
          if (explain === edit.explain) {
            ElMessage.error('功能名称已存在，不能重复')
            return
          }
          for (let c = 0, clen = cmds.length; c < clen; c++) {
            if (edit.cmds.includes(cmds[c])) {
              ElMessage.error(`响应词${cmds[c]}已存在，不能重复`)
              return
            }
          }
        }
      }
      if (!edit.code) {
        edit.code = id.value
      }
      const index = features.value.findIndex((item: DbFeature) => item._id === id.value)
      if (index >= 0) {
        features.value.splice(index, 1, {
          _id: id.value,
          _rev: rev.value,
          data: toRaw(edit),
        })
      } else {
        features.value.push({
          _id: id.value,
          _rev: rev.value,
          // @ts-ignore
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
      }, 1000)
    } catch (err: any) {
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

  .m-0 {
    margin: 0;
  }
  .m-t-40 {
    margin-top: 40px;
  }
  .p-b-10 {
    padding-bottom: 10px;
  }

  .tag-input {
    display: inline-block;
    width: 100px;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
