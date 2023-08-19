<!--选择指令批量生成数据-->
<template>
  <h2 class="m-y-20px">批量生成</h2>
  <el-form label-position="left" label-width="80px">
    <el-form-item label="选择指令">
      <el-select placeholder="请选择指令" filterable v-model="curFeature" class="w-200px">
        <el-option v-for="item in commands" :key="item._id" :label="item.data.explain" :value="item._id"> </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="生成数量">
      <el-input-number :min="1" :max="500" v-model="number" step-strictly></el-input-number>
    </el-form-item>
    <el-form-item label="过滤重复">
      <el-tooltip effect="dark" content="如果你的使用场景数据不能重复，可以开启该功能，开启后将过滤重复数据，但具体数量可能小于填写的生成数量" placement="top-start">
        <el-switch v-model="isFilterRepeat" />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="分割符号">
      <el-input placeholder="\r\n" v-model="symbol"></el-input>
    </el-form-item>
    <el-form-item label="生成结果">
      <el-input type="textarea" v-model="result" placeholder="单次最多生成 500 个，生成后可复制使用" :autosize="{ minRows: 8, maxRows: 8 }"></el-input>
    </el-form-item>
  </el-form>
  <div class="m-y-20px flex items-center justify-end">
    <el-button type="primary" @click="saveCmd">生 成</el-button>
    <el-button @click="copyResult">复制结果</el-button>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import { useAppStore } from '../../store/app.store'
  import { copyText } from '../../utils'
  import { runCmd } from '../../commands/parse'
  const appStore = useAppStore()
  const { commands } = storeToRefs(appStore)

  const route = useRoute()
  const { id = '' } = route.query

  const curFeature = ref('')
  const number = ref(1)
  const symbol = ref('\r\n')
  const result = ref('')
  const isFilterRepeat = ref(false)

  onMounted(() => {
    curFeature.value = id as string
  })

  const saveCmd = () => {
    if (!curFeature) {
      return ElMessage.error('请选择指令')
    }
    const content = commands.value.find((item: DbDoc) => item._id === curFeature.value)?.data.content
    if (!content) return
    let text = ''
    const arr = []
    for (let i = 0; i < number.value; i++) {
      arr.push(runCmd(content))
    }
    if (isFilterRepeat.value) {
      const _arr = [...new Set(arr)]
      text = _arr.join(symbol.value)
      ElMessage.info(`已过滤重复内容，实际生成 ${_arr.length} 条`)
    } else {
      text = arr.join(symbol.value)
    }
    result.value = text
  }

  const copyResult = () => {
    if (!result) {
      return ElMessage.error('请先生成数据')
    }
    copyText(result.value)
    ElMessage.success('复制成功')
  }
</script>

<style scoped lang="scss">
  :deep(.el-input-number) {
    width: 200px;
  }

  :deep(.el-textarea__inner) {
    resize: none;
  }
</style>
