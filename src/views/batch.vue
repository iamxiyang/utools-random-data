<!--选择指令批量生成数据-->
<template>
  <h2 class="m-y-20">批量生成</h2>
  <el-form label-position="left" label-width="80px">
    <el-form-item label="选择指令">
      <el-select placeholder="请选择指令" filterable v-model="curFeature" class="w-200">
        <el-option v-for="item in features" :key="item._id" :label="item.data.explain" :value="item._id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="生成数量">
      <el-input-number :min="1" :max="500" v-model="number" step-strictly></el-input-number>
    </el-form-item>
    <el-form-item label="分割符号">
      <el-input placeholder="\r\n" v-model="symbol"></el-input>
    </el-form-item>
    <el-form-item label="生成结果">
      <el-input type="textarea" v-model="result" placeholder="单次最多生成 500 个，生成后可复制使用" :autosize="{ minRows: 8, maxRows: 12 }"></el-input>
    </el-form-item>
  </el-form>
  <div class="m-y-20 footer">
    <el-button type="primary" @click="saveCmd">生 成</el-button>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRoute, useRouter } from 'vue-router'
  import useAppStore from '../store/index'
  import { runCmd } from '../utils/random'

  const appStore = useAppStore()
  const router = useRouter()
  const { features } = storeToRefs(appStore)

  const route = useRoute()
  const { id = '' } = route.params

  let curFeature = $ref('')
  let number = $ref(1)
  let symbol = $ref('\r\n')
  let result = $ref('')

  onMounted(() => {
    curFeature = id as string
  })

  const saveCmd = () => {
    if (!curFeature) {
      return ElMessage.error('请选择指令')
    }
    let text = ''
    // @ts-ignore
    const content = features.value.find((item) => item._id === curFeature)?.data.content
    if (!content) return
    for (let i = 0; i < number; i++) {
      text += runCmd(content)
      if (i !== number - 1) {
        text += symbol || '\r\n'
      }
    }
    result = text
  }
</script>

<style scoped lang="scss">
  :deep(.el-input-number) {
    width: 200px;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
