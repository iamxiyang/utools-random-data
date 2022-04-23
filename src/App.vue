<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
<script setup lang="ts">
  import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>
<style lang="scss">
  body {
    margin: 0;
  }

  .m-y-20 {
    margin-top: 20px !important;
    margin-bottom: 20px !important;
  }

  .w-200 {
    width: 200px;
  }
</style>
