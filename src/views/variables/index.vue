<template>
  <el-button type="primary" class="m-y-20px" @click="editVar('')"> 添加新变量 </el-button>
  <el-table :data="allVariables">
    <el-table-column prop="name" label="变量名">
      <template #default="{ row }">
        {{ `$\{${row.name}\}` }}
      </template>
    </el-table-column>
    <el-table-column prop="example" label="示例">
      <template #default="{ row }">
        {{ row.example ? row.example : _evaluate(row.code) }}
      </template>
    </el-table-column>
    <el-table-column prop="explain" label="说明"></el-table-column>
    <el-table-column label="操作" align="center">
      <template #default="{ row }">
        <p v-if="row.fun">系统内置</p>
        <template v-else>
          <el-button type="primary" text @click="editVar(row._id)">编辑</el-button>
          <el-popconfirm title="确定要删除吗? 一旦删除不可恢复" width="170" @confirm="deleteVar(row)">
            <template #reference>
              <el-button type="danger" text class="!px-4px">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
  import { useAppStore } from '../../store/app.store'
  import { evaluate } from '../../utils/variable'
  const router = useRouter()
  const appStore = useAppStore()
  const { allVariables, variables } = storeToRefs(appStore)

  const _evaluate = (code: string) => {
    try {
      return evaluate(code, true)
    } catch (err) {
      return '出错' + err
    }
  }

  const editVar = (id: string = '') => {
    router.push({
      name: '/variables/edit',
      query: { id },
    })
  }

  const deleteVar = (row: DbVariables) => {
    const index = variables.value.findIndex((item: DbVariables) => item.data?.name === row.name)
    if (index > -1) {
      variables.value.splice(index, 1)
    }
  }
</script>

<style scoped lang="scss"></style>
