<template>
  <el-table :data="data">
    <el-table-column prop="name" label="变量名"></el-table-column>
    <el-table-column prop="example" label="示例"> </el-table-column>
    <el-table-column prop="description" label="说明"></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
  import variable from '../constant/variable'

  const data = computed(() => {
    return Object.keys(variable).map((key) => {
      return {
        name: key,
        example: variable[key].example,
        description: variable[key].description,
      }
    })
  })
</script>

<style scoped lang="scss"></style>
