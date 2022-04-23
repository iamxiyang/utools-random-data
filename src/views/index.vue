<!--已创建指令列表-->
<template>
  <el-button type="primary" class="m-y-20" @click="editCmd('')"> 添加新指令 </el-button>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="explain" label="指令名称" />
    <el-table-column prop="cmds" label="唤醒词汇" />
    <el-table-column label="快捷启动" width="90">
      <template #default="scope">
        <el-tooltip class="box-item" effect="dark" content="开启后可通过uTools搜索框直接键入唤醒词使用" placement="top-start">
          <el-switch :value="scope.row.feature" @change="(val:boolean) => featureChange(val, scope.row.index)" />
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="操作">
      <template #default="scope">
        <el-button type="text" @click="editCmd(scope.row._id)">修改</el-button>
        <el-popconfirm title="确定要删除?一旦删除不可恢复" @confirm="deleteCmd(scope.row.index)">
          <template #reference>
            <el-button type="text"> 删除 </el-button>
          </template>
        </el-popconfirm>
        <el-button type="text" @click="batchCmd(scope.row._id)"> 批量生成 </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { computed } from '@vue/runtime-core'
  import { storeToRefs } from 'pinia'

  import useAppStore from '../store/index'
  const appStore = useAppStore()
  const router = useRouter()
  const { features } = storeToRefs(appStore)

  // TODO 当前页面响应比较慢，需要优化
  const tableData = computed(() => {
    return features.value.map((item: any, index) => {
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
    } catch (err) {}
  }

  // 批量生成
  const batchCmd = async (id: string) => {
    router.push({
      name: 'batch',
      params: { id },
    })
  }
</script>

<style scoped lang="scss"></style>
