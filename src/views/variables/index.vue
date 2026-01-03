<template>
  <div class="page-container page-flex">
    <div class="page-header">
      <div class="flex items-center gap-12px">
        <h2>变量列表</h2>
        <el-input
          v-model="searchText"
          placeholder="搜索变量..."
          clearable
          style="width: 240px"
          :prefix-icon="Search"
        />
      </div>
      <el-button type="primary" size="large" @click="editVar('')">
        <template #icon>
          <el-icon><Plus /></el-icon>
        </template>
        添加新变量
      </el-button>
    </div>
    
    <div class="page-table-card variables-table">
      <el-table :data="filteredVariables" style="width: 100%; height: 100%">
        <el-table-column prop="name" label="变量名" min-width="150">
          <template #default="{ row }">
            <code class="var-name-code">{{ `$\{${row.name}\}` }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="example" label="示例" min-width="180">
          <template #default="{ row }">
            <span class="example-text">{{ row.example ? row.example : _evaluate(row.code) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="explain" label="说明" min-width="200"></el-table-column>
        <el-table-column label="操作" align="center" width="140" fixed="right">
          <template #default="{ row }">
            <template v-if="!row.fun">
              <el-button type="primary" link @click="editVar(row._id)">编辑</el-button>
              <el-divider direction="vertical" />
              <el-popconfirm title="确定要删除吗? 一旦删除不可恢复" width="170" @confirm="deleteVar(row)">
                <template #reference>
                  <el-button type="danger" link>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
            <el-tag v-else size="small" type="info">内置</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Plus, Search } from '@element-plus/icons-vue'
  import { useAppStore } from '../../store/app.store'
  import { evaluate } from '../../utils/variable'

  const router = useRouter()
  const appStore = useAppStore()
  const { allVariables, variables } = storeToRefs(appStore)
  
  const searchText = ref('')

  const filteredVariables = computed(() => {
    if (!searchText.value) return allVariables.value
    const lower = searchText.value.toLowerCase()
    return allVariables.value.filter(v => 
      v.name?.toLowerCase().includes(lower) || 
      v.explain?.toLowerCase().includes(lower)
    )
  })

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

  const deleteVar = (row: any) => {
    const index = variables.value.findIndex((item: DbVariables) => item.data?.name === row.name)
    if (index > -1) {
      variables.value.splice(index, 1)
    }
  }
</script>

<style scoped lang="scss">
  .variables-table {
    :deep(.el-table) {
      border-radius: 6px;
    }
    
    /* 统一表格内所有单元格的字体大小 */
    :deep(.el-table__cell) {
      font-size: var(--app-table-font-size);
    }
  }

  .var-name-code {
    font-family: 'Fira Code', Consolas, monospace;
    font-size: var(--app-table-font-size);
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
  }

  .example-text {
    color: var(--el-text-color-regular);
    font-size: var(--app-table-font-size);
  }

  .ml-8px {
    margin-left: 8px;
  }
</style>
