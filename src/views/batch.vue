<!--选择指令批量生成数据-->
<template>
  <h2 class="m-y-20">批量生成</h2>
  <el-form label-position="left" label-width="80px">
    <el-form-item label="选择指令">
      <el-select placeholder="请选择指令" filterable class="w-200" @change="cccChange">
        <el-option v-for="item in allDocs" :key="item._id" :label="item.data.explain" :value="item.data.code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="生成数量">
      <el-input-number min="1" step-strictly></el-input-number>
    </el-form-item>
    <el-form-item label="分割符号">
      <el-input placeholder="\r"></el-input>
    </el-form-item>
    <el-form-item label="生成结果">
      <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 14 }"></el-input>
    </el-form-item>
  </el-form>
  <div class="m-y-20 footer">
    <el-button type="primary" @click="saveCmd">生 成</el-button>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import router from '../router'

  const route = useRoute()
  const { type = '' } = route.params

  const allDocs = utools.db.allDocs('cmd-')

  const back = () => {
    router.back()
  }
  const cccChange = (val: string) => {
    console.log(val)
  }
  const saveCmd = () => {}
</script>

<style scoped lang="scss">
  :deep.el-input-number {
    width: 200px;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
