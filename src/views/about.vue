<template>
  <h2 class="m-y-20px">关于插件</h2>
  <p>随机生成虚假数据插件，是一款 <strong>开源</strong>、<strong>免费</strong> 的 uTools 插件。该插件的目的是帮助开发和测试人员在开发阶段进行数据测试，所有生成的数据都是虚假的，只确保符合特定校验规则，并不是真实存在的。</p>
  <p>如果这个插件帮到了您，您可以在插件商店打 5 分好评，或者在 Github 点一个 Star，这将是作者持续维护的动力。</p>
  <p>开源地址<span class="link ml-2" @click="openGithub">https://github.com/iamxiyang/utools-random-data</span></p>
  <img src="../assets/mp-qrcode.jpg" class="w-200px" />
  <p class="mt-2px">作者微信公众号</p>
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
</style>
