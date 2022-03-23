<template>
  <div class="layout-container">
    <el-menu :default-active="$route.name" @select="menuSelect">
      <el-menu-item index="index">指令列表</el-menu-item>
      <el-menu-item index="batch">批量生成</el-menu-item>
      <el-menu-item index="about">关于插件</el-menu-item>
      <el-menu-item index="variable" v-if="isDev">内置变量</el-menu-item>
    </el-menu>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  const isDev = import.meta.env.DEV
  const router = useRouter()
  const menuSelect = (key: string, keyPath: string[]) => {
    router.push({
      name: key,
    })
  }
</script>

<style scoped lang="scss">
  .layout-container {
    display: flex;
    align-content: flex-start;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    .view {
      flex: 1;
      padding: 0 20px;
      height: 100vh;
      overflow-y: scroll;
    }
  }
</style>
