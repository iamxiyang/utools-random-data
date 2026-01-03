<template>
  <div class="layout-container" :class="routeName">
    <div v-if="showLayout" class="sidebar">
      <el-menu
        :default-active="$route.path"
        router
        class="custom-menu"
        :collapse="false"
      >
        <el-menu-item index="/commands/">
          <div class="menu-item-content">
            <el-icon><List /></el-icon>
            <span class="menu-label">指令列表</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/variables/">
          <div class="menu-item-content">
            <el-icon><Coin /></el-icon>
            <span class="menu-label">变量列表</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/commands/batch">
          <div class="menu-item-content">
            <el-icon><Files /></el-icon>
            <span class="menu-label">批量生成</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/import-export">
          <div class="menu-item-content">
            <el-icon><Sort /></el-icon>
            <span class="menu-label">导入导出</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/about">
          <div class="menu-item-content">
            <el-icon><InfoFilled /></el-icon>
            <span class="menu-label">关于插件</span>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { List, Coin, Files, Sort, InfoFilled } from '@element-plus/icons-vue'

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
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: var(--el-bg-color-page);

    .sidebar {
      width: 110px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--el-border-color-light);
      background-color: var(--el-bg-color);
      flex-shrink: 0;
      transition: width 0.3s;

      .custom-menu {
        flex: 1;
        border-right: none;
        
        :deep(.el-menu-item) {
          margin: 6px 8px;
          border-radius: 8px;
          height: 64px;
          line-height: normal;
          padding: 0 !important;
          display: flex;
          justify-content: center;
          align-items: center;

          .menu-item-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            width: 100%;

            .el-icon {
              margin: 0;
              font-size: 20px;
            }

            .menu-label {
              font-size: 12px;
              font-weight: 500;
            }
          }

          &.is-active {
            background-color: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
          }

          &:hover:not(.is-active) {
            background-color: var(--el-fill-color-light);
          }
        }
      }
    }

    .view {
      flex: 1;
      height: 100vh;
      width: calc(100vw - 110px);
      overflow-y: auto;
      background-color: var(--el-bg-color-page);
      scrollbar-width: none;
      &::-webkit-scrollbar {
          display: none;
      }
    }

    &.commands-random-all {
      .view {
        padding: 0;
        width: 100vw;
      }
    }
  }
</style>
