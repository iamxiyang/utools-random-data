<template>
  <el-button type="primary" class="m-y-20px" @click="editVar('')"> 添加新变量 </el-button>
  <el-table :data="allVariables">
    <el-table-column prop="name" label="变量名"></el-table-column>
    <el-table-column prop="name" label="内置变量"></el-table-column>
    <el-table-column prop="example" label="示例">
      <template #default="{ row }">
        {{ row.example ? row.example : _evaluate(row.code) }}
      </template>
    </el-table-column>
    <el-table-column prop="description" label="说明"></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
  import { useAppStore } from '../../store/app.store'
  import { evaluate } from '../../utils/variable'
  const router = useRouter()
  const appStore = useAppStore()
  const { allVariables } = storeToRefs(appStore)

  const editVar = (id: string) => {
    router.push({
      name: '/variables/edit',
      params: { id },
    })
  }

  const _evaluate = (code: string) => {
    try {
      return evaluate(code, true)
    } catch (err) {
      return '出错' + err
    }
  }
  // const data = computed(() => {
  //   return Object.keys(allVariables).map((key) => {
  //     return {
  //       name: key,
  //       example: variable[key].example,
  //       description: variable[key].description,
  //     }
  //   })
  // })
</script>

<style scoped lang="scss"></style>
