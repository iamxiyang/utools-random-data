<!-- 变量列表 -->
<template>
  <el-dialog v-model="dialogTableVisible" title="Shipping address">
    <el-table :data="variable" border style="width: 100%">
      <el-table-column prop="name" label="变量名" width="180" />
      <el-table-column prop="arguments" label="传参" width="180" />
      <el-table-column prop="example" label="示例" />
    </el-table>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import variable from '../constant/variable'
  const props = defineProps<{
    dialogTableVisible: boolean
  }>()
</script>
