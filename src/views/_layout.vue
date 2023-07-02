<template>
  <div class="layout-container">
    <el-menu :default-active="$route.name" router>
      <el-menu-item index="/commands/">指令列表</el-menu-item>
      <el-menu-item index="/variables/">变量列表</el-menu-item>
      <el-menu-item index="/commands/batch">批量生成</el-menu-item>
      <el-menu-item index="/about">关于插件</el-menu-item>
    </el-menu>
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

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
  }
</style>
