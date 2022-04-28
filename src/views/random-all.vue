<template>
  <div v-for="(item, index) in features" :key="item._id" class="line" :class="{ active: active === index }" @click="runCmd(item.data.content)">
    <img src="/logo.png" class="icon" alt="logo" />
    <div class="content">
      <p class="explain">{{ item.data.explain }}</p>
      <div v-if="item.data.feature">
        <span class="m-r-10 tag" v-for="tag in item.data.cmds" :key="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import useAppStore from '../store/index'
  import { runCmd } from '../utils/random'
  import { copyPasteOut } from '../utils/utools'

  const appStore = useAppStore()
  const router = useRouter()
  const { features } = $(storeToRefs(appStore))

  let active = $ref(0)

  const keyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
        if (active > 0) {
          active = active - 1
        }
        break
      case 'ArrowDown':
        if (active < features.length - 1) {
          active = active + 1
        }
        break
      case 'Enter':
      case 'Space':
        const text = runCmd(features[active].data.content)
        if (text) {
          copyPasteOut(text)
        } else {
          router.replace('/index')
        }
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', keyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', keyDown)
  })
</script>

<style scoped lang="scss">
  .line {
    display: flex;
    align-items: center;
    padding: 10px 1%;
    border-bottom: 1px solid #f2f2f2;
    cursor: pointer;
    &:active,
    &.active {
      background-color: #dee2e6;
    }
    .icon {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      margin-right: 16px;
      object-fit: contain;
      image-rendering: -webkit-optimize-contrast;
    }
    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .explain {
      margin: 0 0 2px 0;
      font-size: 14px;
    }
    .tag {
      color: #8a8a8a;
      font-size: 12px;
    }
  }
  .m-r-10 {
    margin-right: 10px;
  }
</style>
