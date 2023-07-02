<template>
  <div>
    <p>编辑页面</p>
    <div ref="editorRef" style="height: 600px"></div>
    <!-- 名称，代码，测试用例（传参，需要支持不传参生成？） -->
    <!-- 测试，保存 -->
  </div>
</template>

<script setup lang="ts">
  // https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md
  import * as monaco from 'monaco-editor'
  // 初始化编辑器
  const editorRef = ref<HTMLElement>()

  watch(editorRef, () => {
    if (!editorRef.value) return
    const editor = monaco.editor.create(editorRef.value, {
      value: '',
      language: 'javascript',
      theme: 'vs',
      tabSize: 2,
    })

    // 监听编辑器内容变化
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue()
      console.log(code)
    })
  })


</script>

<style>
  @import 'monaco-editor/min/vs/editor/editor.main.css';
</style>
