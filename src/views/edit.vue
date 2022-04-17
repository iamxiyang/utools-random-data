<!--创建和编辑指令-->
<template>
  <el-page-header class="m-y-20" :icon="ArrowLeft" content="编辑指令" @back="router.back()" />
  <el-form label-position="top" ref="ruleFormRef" :model="info" :rules="formRules">
    <el-form-item prop="explain" label="功能名称，干什么用的">
      <el-input v-model="info.explain"></el-input>
    </el-form-item>
    <el-form-item required prop="cmds" label="响应词，uTools输入框用来快捷生成">
      <el-tag v-for="cmd in info.cmds" :key="cmd" :disable-transitions="false" closable @close="delCmd(cmd)">
        {{ cmd }}
      </el-tag>
      <el-input class="tag-input" v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm"> </el-input>
      <el-button v-else-if="info.cmds.length < 5" size="small" @click="showInput"> + 新唤醒词 </el-button>
    </el-form-item>
    <el-form-item prop="setFeature" label="快捷启动">
      <el-tooltip class="box-item" effect="dark" content="开启后可通过uTools搜索框直接键入指令名使用" placement="top-start">
        <el-switch v-model="info.setFeature"></el-switch>
      </el-tooltip>
    </el-form-item>
    <el-form-item required prop="content" label="指令内容">
      <el-input type="textarea" v-model="info.content" :autosize="{ minRows: 6, maxRows: 16 }"></el-input>
      <div class="m-y-20">
        <el-select placeholder="插入变量" filterable @change="addVariable">
          <el-option v-for="item in variable" :key="item.example" :label="item.example" :value="item.name"></el-option>
        </el-select>
      </div>
    </el-form-item>
  </el-form>
  <div class="m-y-20 footer">
    <el-button @click="testCmd" :disabled="!info.content">测 试</el-button>
    <el-button type="primary" @click="saveCmd(ruleFormRef)">保 存</el-button>
  </div>

  <!-- <variable :dialog-table-visible="showDialog"></variable> -->
</template>

<script setup lang="ts">
  import router from '../router'
  import { ArrowLeft } from '@element-plus/icons-vue'

  import { nextTick, reactive, onMounted, toRaw, ref } from 'vue'
  import { ElForm, ElInput, ElMessage } from 'element-plus'
  import { useRoute } from 'vue-router'
  import variable from '../constant/variable'
  import { runCmd } from '../utils/random'
  import Variable from '../components/variable.vue'
  import { uuid } from '../random'
  export type ElFormInstance = InstanceType<typeof ElForm>

  const route = useRoute()
  const { id = '' } = route.params

  const defaultInfo = {
    cmds: [],
    explain: '',
    setFeature: true,
    content: '',
  }
  console.log(defaultInfo)

  const info: any = reactive(defaultInfo)

  // 效验
  const validatePass = (rule: any, value: any, callback: any) => {
    if ((!value || value.length === 0) && !info.setFeature) {
      callback(new Error('快捷启动时唤醒词不能为空'))
    } else {
      callback()
    }
  }

  const ruleFormRef = ref<ElFormInstance>()

  const formRules: any = reactive({
    cmds: [{ trigger: 'blur', validator: validatePass }],
    content: [{ trigger: 'blur', required: true, message: '指令内容必须填写' }],
    explain: [{ trigger: 'blur', required: true, message: '指令名称必须填写' }],
  })

  let _rev = $ref('')

  let showDialog = ref(true)
  onMounted(() => {
    const old = utools.db.get(id as string)
    if (old) {
      Object.assign(info, old.data)
      _rev = old._rev as string
    } else {
      Object.assign(info, defaultInfo)
    }
  })

  let inputValue = $ref('')
  let inputVisible = $ref(false)
  let InputRef = $ref<InstanceType<typeof ElInput>>()

  const delCmd = (tag: string) => {
    info.cmds.splice(info.cmds.indexOf(tag), 1)
  }

  const showInput = () => {
    inputVisible = true
    nextTick(() => {
      InputRef!.input!.focus()
    })
  }

  const handleInputConfirm = () => {
    if (inputValue) {
      info.cmds.push(inputValue)
    }
    inputVisible = false
    inputValue = ''
  }

  // 添加变量
  const addVariable = (val: string) => {
    info.content = info.content + val
  }
  // 进行指令测试
  const testCmd = () => {
    runCmd(info.content)
  }
  // 保存指令
  const saveCmd = async (formEl: ElFormInstance | undefined) => {
    try {
      if (!formEl) return
      await formEl.validate()
      const data = toRaw(info)
      utools.db.put({
        _id: (id || 'cmd-' + uuid()) as string,
        _rev,
        data,
      })
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
    margin-bottom: 14px;
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

function $ref(arg0: string) { throw new Error('Function not implemented.') } function ref(arg0: string) { throw new Error('Function not implemented.') }
