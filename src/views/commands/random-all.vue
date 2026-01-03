<template>
  <div class="random-all-container" ref="containerRef">
    <div
      v-for="(item, index) in commands"
      :key="item._id"
      class="line"
      :class="{ active: active === index }"
      :ref="(el) => (itemRefs[index] = el)"
      @click="clickCmd(item)"
      @mouseenter="active = index"
    >
      <div class="active-indicator"></div>
      <div class="icon-wrapper">
        <img src="/logo.png" class="icon" alt="logo" />
      </div>
      <div class="content" v-if="item.data">
        <div class="header-row">
          <p class="explain">{{ item.data.explain }}</p>
          <div class="tags" v-if="item.data.cmds">
            <span class="tag" v-for="tag in item.data.cmds" :key="tag">
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="preview-content" v-if="item.data.content">
          {{ item.data.content }}
        </div>
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
  const containerRef = ref<HTMLElement | null>(null)
  const itemRefs = ref<any[]>([])

  const scrollToActive = () => {
    const activeEl = itemRefs.value[active.value]
    if (activeEl) {
      activeEl.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }

  watch(active, () => {
    scrollToActive()
  })

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
        event.preventDefault()
        if (active.value > 0) {
          active.value--
        } else if (commands.value.length > 0) {
          active.value = commands.value.length - 1
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (active.value < commands.value.length - 1) {
          active.value++
        } else if (commands.value.length > 0) {
          active.value = 0
        }
        break
      case 'Enter':
      case 'Space':
        event.preventDefault()
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

  onMounted(() => {
    setTimeout(() => {
      scrollToActive()
    }, 100)
  })
</script>

<style scoped lang="scss">
  .random-all-container {
    height: 100vh;
    overflow-y: auto;
    background-color: var(--el-bg-color);
    box-sizing: border-box;

    &::-webkit-scrollbar {
      width: 0;
    }
  }

  .line {
    display: flex;
    align-items: flex-start;
    padding: 16px 28px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    border-bottom: 1px solid var(--el-border-color-extra-light);
    background: transparent;

    .active-indicator {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      height: 0;
      margin: auto 0;
      background: var(--el-color-primary);
      border-radius: 0 4px 4px 0;
      transition: height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    &:hover {
      background-color: var(--el-fill-color-lighter);
    }

    &.active {
      background-color: var(--el-color-primary-light-9);

      .active-indicator {
        height: 100%;
      }

      .explain {
        color: var(--el-color-primary);
        font-weight: 600;
      }

      .preview-content {
        opacity: 0.8;
      }

      .tag {
        background-color: var(--el-color-primary-light-8);
        color: var(--el-color-primary);
      }
    }

    .icon-wrapper {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      margin-right: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-fill-color-light);
      border-radius: 6px;
      transition: all 0.3s ease;
      margin-top: 2px;

      .icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
        image-rendering: -webkit-optimize-contrast;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 2px;
    }

    .explain {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      transition: all 0.3s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      letter-spacing: 0.4px;
    }

    .tags {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }

    .tag {
      padding: 0 6px;
      border-radius: 4px;
      background-color: var(--el-fill-color);
      color: var(--el-text-color-secondary);
      font-size: 11px;
      height: 18px;
      line-height: 18px;
      font-weight: 400;
    }

    .preview-content {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0.7;
      transition: all 0.3s ease;
    }
  }
</style>
