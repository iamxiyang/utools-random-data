<template>
  <div v-for="(item, index) in commands" :key="item._id" class="line" :class="{ active: active === index }" @click="clickCmd(item)">
    <img src="/logo.png" class="icon" alt="logo" />
    <div class="content">
      <p class="explain">{{ item.data.explain }}</p>
      <div v-if="item.data.feature">
        <span class="m-r-10px tag" v-for="tag in item.data.cmds" :key="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import { runCmd } from '../../commands/parse'
  import { useAppStore } from '../../store/app.store'
  import { copyPasteOut } from '../../utils/utools'

  const router = useRouter()
  const appStore = useAppStore()
  const { commands } = storeToRefs(appStore)

  const active = ref(0)

  const clickCmd = (item: DbCommands) => {
    const text = runCmd(item.data.content)
    if (text) {
      copyPasteOut(text)
    } else {
      router.replace('/commands')
    }
  }

  const keyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
        if (active.value > 0) {
          active.value--
        }
        break
      case 'ArrowDown':
        if (active.value < commands.value.length - 1) {
          active.value++
        }
        break
      case 'Enter':
      case 'Space':
        const text = runCmd(commands.value[active.value]?.data.content)
        if (text) {
          copyPasteOut(text)
        } else {
          router.replace('/commands')
        }
        break
    }
  }

  useEventListener('keydown', keyDown)
</script>

<style scoped lang="scss">
  .line {
    display: flex;
    align-items: center;
    padding: 10px 1%;
    border-bottom: 1px solid var(--el-border-color-lighter, #f2f2f2);
    cursor: pointer;
    &:active,
    &.active {
      background-color: var(--el-fill-color-light, #dee2e6);
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
</style>
