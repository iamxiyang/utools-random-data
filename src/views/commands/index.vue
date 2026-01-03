<!--已创建指令列表-->
<template>
  <div class="page-container page-flex">
    <!-- Header -->
    <div class="page-header">
      <div class="flex items-center gap-12px">
        <h2>指令管理</h2>
        <el-input
          v-model="searchText"
          placeholder="搜索指令..."
          clearable
          style="width: 240px"
          :prefix-icon="Search"
        />
      </div>
      <el-dropdown split-button type="primary" size="large" @click="editCmd('')" @command="handleDropdownCommand">
        <el-icon class="mr-4px"><Plus /></el-icon>
        添加新指令
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="fromVariable">
              <el-icon><Connection /></el-icon>
              从变量同步
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 从变量同步弹窗 -->
    <el-dialog v-model="syncDialogVisible" title="从变量同步创建指令" width="500px">
      <p class="sync-hint">勾选需要同步的变量，将为每个变量创建同名指令</p>
      <el-checkbox-group v-model="selectedVariables" class="sync-checkbox-group">
        <el-checkbox 
          v-for="v in availableVariables" 
          :key="v.name" 
          :value="v.name"
          :label="v.name"
          class="sync-checkbox-item"
        >
          <div class="sync-var-info">
            <code class="sync-var-name">${{ v.name }}</code>
            <span class="sync-var-explain">{{ v.explain }}</span>
          </div>
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="syncDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSyncFromVariables" :disabled="selectedVariables.length === 0">
          创建 {{ selectedVariables.length }} 个指令
        </el-button>
      </template>
    </el-dialog>

    <div class="page-table-card">
      <!-- 表头 -->
      <div class="command-header">
        <div class="col-drag">{{ searchText ? '' : '排序' }}</div>
        <div class="col-name">指令名称</div>
        <div class="col-cmds">唤醒词汇</div>
        <div class="col-feature">快捷启动</div>
        <div class="col-actions">操作</div>
      </div>

      <!-- 列表 -->
      <div class="command-list" v-if="!searchText">
        <draggable
          v-model="commands"
          item-key="_id"
          handle=".drag-handle"
          ghost-class="drag-ghost"
          animation="200"
          @start="drag = true"
          @end="drag = false"
        >
          <template #item="{ element, index }">
            <div v-if="element && element.data" class="command-item">
              <div class="drag-handle col-drag">
                <el-icon class="drag-icon"><Rank /></el-icon>
              </div>
              <div class="col-name">
                <span class="command-item-name">{{ element.data.explain }}</span>
              </div>
              <div class="col-cmds">
                <div class="cmds-wrapper">
                  <span class="command-item-cmds">{{ element.data.cmds?.join(', ') || '-' }}</span>
                </div>
              </div>
              <div class="col-feature">
                <el-tooltip class="box-item" effect="dark" content="开启后可通过uTools搜索框直接键入唤醒词使用" placement="top">
                  <el-switch :model-value="element.data.feature" @change="(val) => featureChange(!!val, element)" size="small" />
                </el-tooltip>
              </div>
              <div class="col-actions">
                <el-button link type="primary" @click="editCmd(element._id)">编辑</el-button>
                <el-divider direction="vertical" />
                <el-button link type="primary" @click="batchCmd(element._id)">批量</el-button>
                <el-divider direction="vertical" />
                <el-popconfirm title="确定要删除吗? 一旦删除不可恢复" width="200" @confirm="deleteCmd(index)">
                  <template #reference>
                    <el-button link type="danger">删除</el-button>
                   </template>
                </el-popconfirm>
              </div>
            </div>
          </template>
        </draggable>
        <!-- 无指令空状态 -->
        <div v-if="commands.length === 0" class="empty-state">
          <el-empty description="暂无指令，点击上方按钮添加" :image-size="100" />
        </div>
      </div>

      <!-- 搜索结果列表 -->
      <div class="command-list search-mode" v-else>
        <div v-if="filteredCommands.length === 0" class="empty-state">
          <el-empty description="未找到匹配指令" :image-size="100" />
        </div>
        <div v-for="(element) in filteredCommands" :key="element._id" class="command-item">
          <div class="col-drag"></div>
          <div class="col-name">
            <span class="command-item-name">{{ element.data.explain }}</span>
          </div>
          <div class="col-cmds">
            <div class="cmds-wrapper">
              <span class="command-item-cmds">{{ element.data.cmds?.join(', ') || '-' }}</span>
            </div>
          </div>
          <div class="col-feature">
            <el-tooltip class="box-item" effect="dark" content="开启后可通过uTools搜索框直接键入唤醒词使用" placement="top">
              <el-switch :model-value="element.data.feature" @change="(val) => featureChange(!!val, element)" size="small" />
            </el-tooltip>
          </div>
          <div class="col-actions">
            <el-button link type="primary" @click="editCmd(element._id)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button link type="primary" @click="batchCmd(element._id)">批量</el-button>
            <el-divider direction="vertical" />
            <el-popconfirm title="确定要删除吗? 一旦删除不可恢复" width="200" @confirm="deleteCmdById(element._id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { Rank, Plus, Search, Edit, Delete, Files, Connection } from '@element-plus/icons-vue'
  import draggable from 'vuedraggable'
  import { useAppStore } from '../../store/app.store'
  import { UUID } from '../../variables/modules/other'

  const router = useRouter()
  const appStore = useAppStore()
  const { commands, allVariables } = storeToRefs(appStore)

  const drag = ref(false)
  const searchText = ref('')
  const syncDialogVisible = ref(false)
  const selectedVariables = ref<string[]>([])

  // 过滤掉已存在同名指令的变量
  const availableVariables = computed(() => {
    const existingNames = new Set(
      commands.value
        .filter(c => c && c.data)
        .map(c => c.data.explain)
    )
    return allVariables.value.filter(v => !existingNames.has(v.name))
  })

  // 搜索过滤
  const filteredCommands = computed(() => {
    // 先过滤掉无效数据
    const validCommands = commands.value.filter(cmd => cmd && cmd.data)
    if (!searchText.value) return validCommands
    const lower = searchText.value.toLowerCase()
    return validCommands.filter(cmd => 
      cmd.data.explain?.toLowerCase().includes(lower) || 
      cmd.data.cmds?.some(c => c.toLowerCase().includes(lower))
    )
  })

  // 更新: index 改为传递 element 或 id 更安全
  const featureChange = (val: boolean, element: any) => {
    if (!element.data?.cmds?.length) {
      return ElMessage({
        message: '请先编辑，需要添加唤醒词汇后才能开启',
        type: 'error',
      })
    }
    element.data.feature = val
  }

  // 编辑指令
  const editCmd = (id: string) => {
    router.push({ name: '/commands/edit', query: { id } })
  }

  // 删除指令 (By Index - List only)
  const deleteCmd = async (index: number) => {
    try {
      if (commands.value.length === 1) {
        ElMessageBox.alert('就剩最后一个指令了，就别删除了吧，如果指令内容不符合要求可以进行修改')
        return
      }
      commands.value.splice(index, 1)
    } catch (err) {}
  }

   // 删除指令 (By ID - Search mode)
  const deleteCmdById = async (id: string) => {
     try {
       const index = commands.value.findIndex(c => c._id === id)
        if (index > -1) {
            deleteCmd(index)
        }
     } catch(err) {}
  }

  // 批量生成
  const batchCmd = async (id: string) => {
    router.push({
      name: '/commands/batch',
      query: { id },
    })
  }

  // 下拉菜单命令
  const handleDropdownCommand = (command: string) => {
    if (command === 'fromVariable') {
      selectedVariables.value = []
      syncDialogVisible.value = true
    }
  }

  // 确认从变量同步创建指令
  const confirmSyncFromVariables = () => {
    const createdNames: string[] = []
    
    selectedVariables.value.forEach(varName => {
      const cmdId = `cmd-${UUID()}`
      const newCommand: DbCommands = {
        _id: cmdId,
        data: {
          code: cmdId,
          explain: varName,
          cmds: [varName],
          content: `\${${varName}}`,
          feature: false,
        }
      }
      commands.value.unshift(newCommand)
      createdNames.push(varName)
    })
    
    syncDialogVisible.value = false
    ElMessage.success(`已创建 ${createdNames.length} 个指令: ${createdNames.join(', ')}`)
  }

  onMounted(() => {
    const lastTipsVersion = utools.dbStorage?.getItem('last-tips-version')
    if (!lastTipsVersion || lastTipsVersion < 2) {
      // 使用提示
      ElMessageBox.confirm(`该插件的目的是帮助开发、测试人员在开发阶段进行数据测试，所有生成的数据都是虚假的，并不是真实存在的。请您合理使用。`, {
        title: '使用提示',
        confirmButtonText: '我知道了',
        showCancelButton: false,
        type: 'warning',
      })
      utools.dbStorage?.setItem('last-tips-version', 2)
    }
  })
</script>

<style scoped lang="scss">
  /* .page-container and .page-header are now in global styles */

  .command-header {
    display: flex;
    align-items: center;
    padding: 12px 0;
    font-weight: 600;
    color: var(--el-text-color-regular);
    border-bottom: 1px solid var(--el-border-color-lighter);
    font-size: var(--app-table-font-size);
    background: var(--app-table-header-bg);
  }

  /* Shared column widths */
  .col-drag { width: 48px; text-align: center; flex-shrink: 0; display: flex; justify-content: center; }
  .col-name { flex: 1; min-width: 120px; padding: 0 16px; }
  .col-cmds { flex: 1.5; min-width: 150px; padding: 0 16px; color: var(--el-text-color-regular); overflow: hidden; }
  .col-feature { width: 100px; display: flex; justify-content: center; flex-shrink: 0; }
  .col-actions { width: 160px; display: flex; justify-content: center; gap: 4px; flex-shrink: 0; padding-right: 16px; }

  .command-list {
    min-height: 200px;
    max-height: calc(100vh - 180px);
    overflow-y: auto;
    
    /* Ensure no scrollbar shows here but scrolling works */
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  
  .empty-state {
    padding: 40px 0;
    display: flex;
    justify-content: center;
  }

  .command-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
    transition: background-color 0.2s ease;
    background-color: var(--el-bg-color);
    font-size: var(--app-table-font-size);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: var(--el-fill-color-lighter);
    }
  }

  .drag-handle {
    cursor: grab;
    color: var(--el-text-color-placeholder);
    transition: color 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover {
      color: var(--el-color-primary);
    }
    
    &:active {
      cursor: grabbing;
    }
    
    .el-icon {
      font-size: 18px;
    }
  }

  .command-item-name {
    color: var(--el-text-color-primary);
  }

  .cmds-wrapper {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }

  .command-item-cmds {
    font-size: var(--app-table-font-size);
    font-family: var(--el-font-family-monospace);
    background: var(--el-fill-color-lighter);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--el-text-color-secondary);
  }

  .drag-ghost {
    opacity: 0.6;
    background: var(--el-color-primary-light-9) !important;
    border: 1px dashed var(--el-color-primary);
  }

  /* 从变量同步弹窗样式 */
  .sync-hint {
    color: var(--el-text-color-secondary);
    margin-bottom: 16px;
    font-size: 14px;
  }

  .sync-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 300px;
    overflow-y: auto;
  }

  .sync-checkbox-item {
    margin-right: 0 !important;
    padding: 8px 12px;
    background: var(--el-fill-color-lighter);
    border-radius: 6px;
    transition: background-color 0.2s;
    
    &:hover {
      background: var(--el-fill-color);
    }
  }

  .sync-var-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sync-var-name {
    font-family: var(--el-font-family-monospace);
    color: var(--el-color-primary);
    font-size: var(--app-table-font-size);
  }

  .sync-var-explain {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
</style>
