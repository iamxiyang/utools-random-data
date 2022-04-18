<!--创建和编辑指令-->
<template>
  <el-page-header class="m-y-20" :icon="ArrowLeft" content="编辑指令" @back="router.back()" />
  <el-form label-position="top" ref="ruleFormRef" :model="edit" :rules="formRules">
    <el-form-item prop="explain" label="功能名称，干什么用的">
      <el-input v-model="edit.explain"></el-input>
    </el-form-item>
    <el-form-item required prop="cmds" label="响应词，uTools输入框用来快捷生成">
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
          <el-option v-for="item in variable" :key="item.example" :label="item.example" :value="item.name"></el-option>
        </el-select>
      </div>
    </el-form-item>
  </el-form>
  <div class="m-y-20 footer">
    <el-button @click="testCmd">测 试</el-button>
    <el-button type="primary" @click="saveCmd(ruleFormRef)">保 存</el-button>
  </div>

  <!-- <variable :dialog-table-visible="showDialog"></variable> -->
</template>

<script setup lang="ts">
  import router from '../router'
  import { ArrowLeft } from '@element-plus/icons-vue'

  import { nextTick, reactive, computed, toRaw, ref, onMounted } from 'vue'
  import { ElForm, ElInput, ElMessage } from 'element-plus'
  import { useRoute } from 'vue-router'
  import variable from '../constant/variable'
  import { runCmd } from '../utils/random'
  import Variable from '../components/variable.vue'
  import { uuid } from '../random'
  import { storeToRefs } from 'pinia'
  export type ElFormInstance = InstanceType<typeof ElForm>
  import useAppStore from '../store/index'
  import { cloneDeep, uniqueId } from 'lodash'
  const appStore = useAppStore()
  const { features } = storeToRefs(appStore)

  const defaultEdit = {
    code: uniqueId(),
    explain: '',
    cmds: [],
    content: '',
    feature: false,
  }

  const id = ref('')
  const rev = ref('')
  let edit: Feature = reactive({ ...defaultEdit })
  let originEdit: Feature = reactive({ ...cloneDeep(defaultEdit) })

  // 效验
  const validatePass = (rule: any, value: any, callback: any) => {
    if ((!value || value.length === 0) && !edit.feature) {
      callback(new Error('快捷启动时唤醒词不能为空'))
    } else {
      callback()
    }
  }

  onMounted(() => {
    const { id: queryId } = useRoute().query
    id.value = (queryId as string) || uuid()

    if (queryId) {
      const data = features.value.find((item) => item._id === queryId)

      if (data) {
        rev.value = data._rev as string
        edit = Object.assign({}, data.data)
        originEdit = Object.assign({}, cloneDeep(data.data))
        // TODO更新不对
        console.log(edit)
      }
    }
  })

  const ruleFormRef = ref<ElFormInstance>()

  const formRules: any = reactive({
    cmds: [{ trigger: 'blur', validator: validatePass }],
    content: [{ trigger: 'blur', required: true, message: '指令内容必须填写' }],
    explain: [{ trigger: 'blur', required: true, message: '指令名称必须填写' }],
  })

  let _rev = $ref('')

  let showDialog = ref(true)

  let inputValue = $ref('')
  let inputVisible = $ref(false)
  let InputRef = $ref<InstanceType<typeof ElInput>>()

  const delCmd = (tag: string) => {
    edit.cmds.splice(edit.cmds.indexOf(tag), 1)
  }

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
  // 进行指令测试
  const testCmd = () => {
    runCmd(edit.content)
  }
  // 保存指令
  const saveCmd = async (formEl: ElFormInstance | undefined) => {
    try {
      if (!formEl) return
      await formEl.validate()
      const data = toRaw(editInfo)
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
