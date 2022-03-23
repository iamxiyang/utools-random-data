<!--已创建指令列表-->
<template>
  <el-button type="primary" class="m-y-20" @click="editCmd"> 添加新指令 </el-button>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="explain" label="指令名称" />
    <el-table-column prop="cmds" label="唤醒词汇" />
    <el-table-column label="快捷启动" width="90">
      <template #default="scope">
        <el-tooltip class="box-item" effect="dark" content="开启后可通过uTools搜索框直接键入指令名使用" placement="top-start">
          <el-switch v-model="scope.row.setFeature" @change="(val = true) => featureChange(val, scope.row)" />
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="操作">
      <template #default="scope">
        <el-button type="text" @click="editCmd(scope.row._id)">修改</el-button>
        <el-popconfirm title="确定要删除?" @confirm="deleteCmd(scope.row._id, scope.row.code)">
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
  import { ElMessageBox } from 'element-plus'
  import { computed, onMounted, reactive, toRefs } from '@vue/runtime-core'
  import { toRaw } from 'vue'

  const router = useRouter()

  let state: any = reactive({
    allDocs: [] as any[],
    tableData: computed(() => {
      return state.allDocs.map((item: any) => {
        return { _id: item._id, _rev: item._rev, ...item.data }
      })
    }),
  })

  const { tableData } = toRefs(state)

  onMounted(() => {
    state.allDocs = utools.db.allDocs('cmd-')
  })

  // 设置/取消设置快捷启动
  const featureChange = (bool: boolean, item: any) => {
    const { _id, _rev, setFeature, code, explain, cmds } = toRaw(item)
    if (bool) {
      utools.setFeature({
        code,
        explain,
        cmds: toRaw(cmds),
        platform: ['win32', 'darwin', 'linux'],
      })
    } else {
      utools.removeFeature(code)
    }
    utools.db.put({
      _id,
      _rev,
      data: {
        setFeature: bool,
        code,
        explain,
        cmds: toRaw(cmds),
      },
    })
    state.allDocs = utools.db.allDocs('cmd-')
  }

  // 编辑指令
  const editCmd = (id: string) => {
    router.push({ name: 'edit', params: { id } })
  }

  // 删除指令
  const deleteCmd = async (id: string, code: string) => {
    try {
      if (state.allDocs.length === 1) {
        ElMessageBox.alert('就剩最后一个指令了，就别删除了吧，如果指令内容不符合要求可以进行修改')
        return
      }
      await ElMessageBox.confirm('一旦删除不可恢复，如果再次使用相关指令需要重新创建。', '确定删除 ?')
      utools.db.remove(id)
      utools.removeFeature(code)
      state.allDocs = utools.db.allDocs('cmd-')
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
