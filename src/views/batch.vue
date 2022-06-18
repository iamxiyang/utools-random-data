<!--选择指令批量生成数据-->
<template>
  <h2 class="m-y-20px">批量生成</h2>
  <el-form label-position="left" label-width="80px">
    <el-form-item label="选择指令">
      <el-select placeholder="请选择指令" filterable v-model="curFeature" class="w-200px">
        <el-option v-for="item in features" :key="item._id" :label="item.data.explain" :value="item._id"> </el-option>
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
      <el-input type="textarea" v-model="result" placeholder="单次最多生成 500 个，生成后可复制使用"
        :autosize="{ minRows: 8, maxRows: 12 }"></el-input>
    </el-form-item>
  </el-form>
  <div class="m-y-20px flex items-center justify-end">
    <el-button type="primary" @click="saveCmd">生 成</el-button>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import useAppStore from '../store/index'
import { runCmd } from '../utils/random'

const appStore = useAppStore()
const { features } = storeToRefs(appStore)

const route = useRoute()
const { id = '' } = route.params

let curFeature = $ref('')
let number = $ref(1)
let symbol = $ref('\r\n')
let result = $ref('')
let isFilterRepeat = $ref(false)

onMounted(() => {
  curFeature = id as string
})

const saveCmd = () => {
  if (!curFeature) {
    return ElMessage.error('请选择指令')
  }
  const content = features.value.find((item: DbDoc) => item._id === curFeature)?.data.content
  if (!content) return
  let text = ''
  const arr = []
  for (let i = 0; i < number; i++) {
    arr.push(runCmd(content))
  }
  if (isFilterRepeat) {
    const _arr = [...new Set(arr)]
    text = _arr.join(symbol)
    ElMessage.info(`已过滤重复内容，实际生成 ${_arr.length} 条`)
  } else {
    text = arr.join(symbol)
  }
  result = text
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
