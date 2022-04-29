<template>
  <h2 class="m-y-20">关于插件</h2>
  <p>随机生成虚假数据插件，是一款 <strong>开源</strong>、<strong>免费</strong> 的 uTools 插件。</p>
  <p>Github地址：<span class="link" @click="openGithub">https://github.com/iamxiyang/utools-random-data</span></p>
  <p>开发者微信：hexiyangwxh <span class="note">（添加时请备注来自uTools随机生成数据插件）</span></p>
  <p>如果这个插件帮到了您，希望能收获到您在插件商店的5分好评，或者在Github的Star，也欢迎您参与代码贡献。</p>
</template>

<script setup lang="ts">
  import { openUrl } from '../utils/helper'
  const openGithub = () => openUrl('https://github.com/iamxiyang/utools-random-data')
</script>

<style scoped lang="scss">
  p {
    font-size: 16px;
    line-height: 2;
    margin-bottom: 10px;
  }

  .link {
    color: #3a8ee6;
    cursor: pointer;
  }

  .note {
    font-size: 14px;
    color: #888;
  }
</style>
