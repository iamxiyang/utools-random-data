<!--创建和编辑指令-->
<template>
  <el-page-header class="m-y-20" :icon="ArrowLeft" content="编辑指令" @back="router.back()" />
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
  import { ArrowLeft } from '@element-plus/icons-vue'
  import { nextTick, reactive, computed, ref, onMounted, toRaw, watchEffect } from 'vue'
  import { ElForm, ElInput, ElMessage } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import variable from '../constant/variable'
  import { runCmd } from '../utils/random'
  import { uuid } from '../random'
  import { storeToRefs } from 'pinia'
  import useAppStore from '../store/index'
  export type ElFormInstance = InstanceType<typeof ElForm>

  const appStore = useAppStore()
  const { features } = $(storeToRefs(appStore))

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

  let id = $ref('')
  let rev = $ref('')
  const defaultData = defaultEdit()
  let edit = $ref<Feature>(defaultData)

  // 初始化数据
  onMounted(() => {
    const { id: queryId } = useRoute().query
    id = (queryId as string) || `cmd-${uuid()}`

    if (queryId) {
      const find = features.find((item) => item._id === queryId)
      const data = find?.data
      if (data) {
        rev = find?._rev as string
        edit = data
      }
    }
  })

  // 自定义唤醒词
  let inputValue = $ref('')
  let tagInputVisible = $ref(false)
  let tagInputRef = $ref<InstanceType<typeof ElInput>>()

  const delCmd = (tag: string) => {
    edit.cmds.splice(edit.cmds.indexOf(tag), 1)
  }

  watchEffect(() => {
    if (tagInputVisible) {
      nextTick(() => {
        tagInputRef!.input!.focus()
      })
    }
  })

  const tagInputConfrim = () => {
    if (inputValue) {
      edit.cmds.push(inputValue)
    }
    tagInputVisible = false
    inputValue = ''
  }

  // 内容效验
  const ruleFormRef = ref<ElFormInstance>()
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

  // 内置变量
  const _variable = computed(() => {
    return Object.keys(variable).map((name) => {
      const { example, description } = variable[name]
      return {
        name,
        example,
        description,
      }
    })
  })
  const addVariable = (val: string) => {
    edit.content = edit.content + val
  }

  // 数据测试
  let dialogTest = $ref(false)
  let testText = $ref<string[] | number[]>([])

  const testCmd = () => {
    const text = runCmd(edit.content)
    const text2 = runCmd(edit.content)
    testText = [text, text2]
    dialogTest = true
  }

  // 保存指令
  const saveCmd = async (formEl: ElFormInstance | undefined) => {
    try {
      if (!formEl) return
      await formEl.validate()
      // 判断功能名称不能重复
      for (let i = 0, len = features.length; i < len; i++) {
        const _id = features[i]._id
        const { explain } = features[i].data
        if (_id !== id && explain === edit.explain) {
          ElMessage.error('功能名称已存在，不能重复')
          break
        }
      }
      if (!edit.code) {
        edit.code = id
      }
      const index = features.findIndex((item) => item._id === id)
      if (index >= 0) {
        features.splice(index, 1, {
          _id: id,
          _rev: rev,
          data: toRaw(edit),
        })
      } else {
        features.push({
          _id: id,
          _rev: rev,
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
