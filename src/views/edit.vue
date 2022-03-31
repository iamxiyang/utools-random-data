<!--创建和编辑指令-->
<template>
  <el-page-header class="m-y-20" :icon="ArrowLeft" content="编辑指令" @back="router.back()" />
  <el-form label-position="top" :model="info" :rules="formRules">
    <el-form-item required label="功能的唯一标示，不可和其他指令重复">
      <el-input v-model="info.code" :disabled="!!_rev"></el-input>
    </el-form-item>
    <el-form-item required label="响应词，uTools输入框用来快捷生成">
      <el-tag v-for="cmd in info.cmds" :key="cmd" :disable-transitions="false" closable @close="delCmd(cmd)">
        {{ cmd }}
      </el-tag>
      <el-input class="tag-input" v-if="inputVisible" ref="InputRef" v-model="inputValue" size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm"> </el-input>
      <el-button v-else size="small" @click="showInput"> + 新唤醒词 </el-button>
    </el-form-item>
    <el-form-item label="对此功能的说明">
      <el-input v-model="info.explain"></el-input>
    </el-form-item>
    <el-form-item label="快捷启动">
      <el-tooltip class="box-item" effect="dark" content="开启后可通过uTools搜索框直接键入指令名使用" placement="top-start">
        <el-switch v-model="info.setFeature"></el-switch>
      </el-tooltip>
    </el-form-item>
    <el-form-item required label="指令内容">
      <el-input type="textarea" v-model="info.content" :autosize="{ minRows: 6, maxRows: 16 }"></el-input>
      <div class="m-y-20">
        <el-select placeholder="插入变量" filterable @change="addVariable">
          <el-option v-for="item in variable" :key="item.example" :label="item.example" :value="item.name"></el-option>
        </el-select>
      </div>
    </el-form-item>
  </el-form>
  <div class="m-y-20 footer">
    <el-button @click="testCmd">测 试</el-button>
    <el-button type="primary" @click="saveCmd">保 存</el-button>
  </div>

  <!-- <variable :dialog-table-visible="showDialog"></variable> -->
</template>

<script setup lang="ts">
  import router from '../router'
  import { ArrowLeft } from '@element-plus/icons-vue'

  import { nextTick, reactive, onMounted, toRaw, ref } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import { useRoute } from 'vue-router'

  import variable from '../constant/variable'
  import { runCmd } from '../utils/random'
  import Variable from '../components/variable.vue'

  const route = useRoute()
  const { id = '' } = route.params

  const defaultInfo = {
    code: '',
    cmds: [],
    explain: '',
    setFeature: true,
    content: '',
  }
  console.log(defaultInfo)

  const info: any = reactive(defaultInfo)

  // TODO 效验
  const formRules: any = reactive({
    code: [{ trigger: 'blur', required: true }],
  })

  let _rev = $ref('')

  let showDialog = ref(true)
  onMounted(() => {
    console.log(id)

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
  const saveCmd = () => {
    try {
      // 数据为空判断

      if (!info.code) {
        throw new Error('指令名称不能为空')
      }
      if (info.setFeature && !info.cmds.filter((item: any) => item).length) {
        throw new Error('开启快捷启动时响应词不能为空')
      }
      if (!info.content) {
        throw new Error('指令内容不能为空')
      }
      const data = toRaw(info)
      utools.db.put({
        _id: (id || 'cmd-' + info.code) as string,
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
        message: err?.message,
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
