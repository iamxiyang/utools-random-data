<template>
  <div
    v-for="item in allDocs"
    :key="item._id"
    class="line"
    @click="runCmd(item.data.code)"
  >
    <p class="explain">{{ item.data.explain }}</p>
    <div v-if="item.data.setFeature">
      <el-tag
        type="info"
        class="m-r-10"
        v-for="tag in item.data.cmds"
        :key="tag"
      >
        {{ tag }}
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
const allDocs = utools.db.allDocs("cmd-");
// TODO 目前没有utools自带模板的体验好，如不能按键上下选择，后续再考虑优化
const runCmd = (code: string) => {
  alert(code);
};
</script>

<style scoped lang="scss">
.line {
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 3%;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
  &:active {
    background-color: #f2f2f2;
  }
  .explain {
    margin: 0 0 6px 0;
    font-size: 15px;
  }
}
.m-r-10 {
  margin-right: 10px;
}
</style>
