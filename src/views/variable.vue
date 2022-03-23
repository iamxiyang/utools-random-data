<template>
  <div v-html="value"></div>
  <el-table>
    <el-table-column prop="name" label="变量名"></el-table-column>
    <el-table-column prop="value" label="参数"></el-table-column>
    <el-table-column prop="value" label="示例">
      <!-- 
      默认：
      参数A： 
      参数B： 
      -->
    </el-table-column>
  </el-table>
</template>

<!-- TODO 这个页面可以当做变量列表 -->
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { runCmd } from '../utils/random'
  import variable from '../constant/variable'

  const value = ref<string>('test')
  onMounted(() => {
    let str = ''
    variable.forEach((item) => {
      str += `<strong>${item.name}</strong> ${item.value}<br/><br/>`
    })
    value.value = runCmd(str) as string
  })
</script>

<style scoped lang="scss"></style>
