<template>
  <h2>utools</h2>
  <button @click="getFeatures">查看feature</button>
  <button>修改</button>
  <button @click="setFeature">新增</button>
  <button @click="allDocs">查看db</button>
  <button @click="allDocsCmd">查看db-cmd</button>
</template>

<script setup lang="ts">
  import { debug } from '../utils/helper'

  const allDocs = () => {
    const a = utools.db.allDocs()
    debug(a)
  }
  const allDocsCmd = () => {
    const a = utools.db.allDocs('cmd-')
    debug(a)
  }
  const getFeatures = () => {
    const features = utools.getFeatures()
    debug(features)
  }
  const setFeature = () => {
    utools.setFeature({
      code: 'hosts',
      explain: 'hosts切换' + new Date().getTime(),
      // "icon": "res/xxx.png",
      // "icon": "data:image/png;base64,xxx...",
      // "platform": ["win32", "darwin", "linux"]
      cmds: ['hosts'],
    })
  }
</script>

<style scoped lang="scss"></style>
