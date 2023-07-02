<template>
  <el-button type="primary" class="m-y-20px" @click="editVar('')"> 添加新变量 </el-button>
  <el-table :data="allVariables">
    <el-table-column prop="name" label="变量名"></el-table-column>
    <el-table-column prop="name" label="内置变量"></el-table-column>
    <el-table-column prop="example" label="示例">
      <template #default="{ row }">
        <!-- TODO 复杂变量，需要传参的可能无法提供示例，如果提供不了，到时候就删掉，或者显示自定义变量不显示示例，或者生成时存起来？需要支持不传参生成？ -->
        {{ row.example ? row.example : _evaluate(row.code) }}
      </template>
    </el-table-column>
    <el-table-column prop="description" label="说明"></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
  import useAppStore from '../../store/app.store'
  const router = useRouter()
  const appStore = useAppStore()
  const { allVariables } = storeToRefs(appStore)

  const _evaluate = (code: string) => {
    return window.preload.evaluate(code, true)
  }

  const editVar = (id: string) => {
    router.push({
      name: '/variables/edit',
      params: { id },
    })
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
