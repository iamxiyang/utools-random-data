<!--已创建指令列表-->
<template>
  <el-button type="primary" class="m-y-20px" @click="editCmd('')"> 添加新指令 </el-button>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="explain" label="指令名称" />
    <el-table-column prop="cmds" label="唤醒词汇" />
    <el-table-column label="快捷启动" width="90">
      <template #default="scope">
        <el-tooltip class="box-item" effect="dark" content="开启后可通过uTools搜索框直接键入唤醒词使用" placement="top-start">
          <el-switch :value="scope.row.feature" @change="(val: boolean) => featureChange(val, scope.row.index)" />
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="address" align="center" label="操作">
      <template #default="scope">
        <el-button text class="!px-4px" type="primary" @click="editCmd(scope.row._id)">修改</el-button>
        <el-popconfirm title="确定要删除?一旦删除不可恢复" @confirm="deleteCmd(scope.row.index)">
          <template #reference>
            <el-button text class="!px-4px" type="primary"> 删除 </el-button>
          </template>
        </el-popconfirm>
        <el-button text class="!px-4px" type="primary" @click="batchCmd(scope.row._id)"> 批量生成 </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'
import useAppStore from '../store/index'

const appStore = useAppStore()
const router = useRouter()
const { features } = storeToRefs(appStore)

const tableData = computed(() => {
  return features.value.map((item: any, index: number) => {
    return { _id: item._id, _rev: item._rev, ...item.data, index }
  })
})

const featureChange = (val: boolean, index: number) => {
  if (!features.value[index].data.cmds?.length) {
    return ElMessage({
      message: '请先编辑，需要添加唤醒词汇后才能开启',
      type: 'error',
    })
  }
  features.value[index].data.feature = val
}

// 编辑指令
const editCmd = (id: string) => {
  router.push({ name: 'edit', query: { id } })
}

// 删除指令
const deleteCmd = async (index: number) => {
  try {
    if (features.value.length === 1) {
      ElMessageBox.alert('就剩最后一个指令了，就别删除了吧，如果指令内容不符合要求可以进行修改')
      return
    }
    features.value.splice(index, 1)
  } catch (err) { }
}

// 批量生成
const batchCmd = async (id: string) => {
  router.push({
    name: 'batch',
    params: { id },
  })
}

onMounted(() => {
  if (window.utools) {
    const lastTipsVersion = window.utools && utools.dbStorage.getItem('last-tips-version')
    if (!lastTipsVersion || lastTipsVersion < 1) {
      // 使用提示
      ElMessageBox.confirm(`该插件的目的是帮助开发、测试人员在开发阶段进行数据测试，所有生成的数据都是虚假的，只确保符合特定校验规则，并不是真实存在的。请您合理使用。`, {
        title: '使用提示',
        confirmButtonText: '我知道了',
        showCancelButton: false,
        type: 'warning',
      });
      window.utools && utools.dbStorage.setItem('last-tips-version', 1)
    }
  }
})

</script>

<style scoped lang="scss">
</style>
