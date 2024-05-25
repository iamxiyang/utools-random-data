<template>
  <div class="layout-container" :class="routeName">
    <el-menu :default-active="$route.name" router v-if="showLayout">
      <el-menu-item index="/commands/">指令列表</el-menu-item>
      <el-menu-item index="/variables/">变量列表</el-menu-item>
      <el-menu-item index="/commands/batch">批量生成</el-menu-item>
      <el-menu-item index="/import-export">导入导出</el-menu-item>
      <el-menu-item index="/about">关于插件</el-menu-item>
    </el-menu>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  const router = useRouter()

  const routeName = computed(() => {
    return router.currentRoute.value.name?.split('/').filter(Boolean).join('-')
  })

  const showLayout = computed(() => {
    return router.currentRoute.value.path !== '/commands/random-all'
  })

  onMounted(() => {
    if (router.currentRoute.value.path === '/') {
      router.replace('/commands/')
    }
  })
</script>

<style lang="scss" scoped>
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

    &.commands-random-all {
      .view {
        padding: 0;
      }
    }
  }
</style>
