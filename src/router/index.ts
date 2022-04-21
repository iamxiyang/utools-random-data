import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/index',
      component: () => import('@/views/layout.vue'),
      children: [
        {
          path: '/index',
          name: 'index',
          component: () => import('@/views/index.vue'),
          meta: {
            title: '指令列表',
          },
        },
        {
          path: '/edit',
          name: 'edit',
          component: () => import('@/views/edit.vue'),
          meta: {
            title: '编辑指令',
          },
        },
        {
          path: '/batch',
          name: 'batch',
          component: () => import('@/views/batch.vue'),
          meta: {
            title: '批量生成',
          },
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/about.vue'),
          meta: {
            title: '关于插件',
          },
        },
        {
          path: '/variable',
          name: 'variable',
          component: () => import('@/views/variable.vue'),
          meta: {
            title: '内置变量',
          },
        },
      ],
    },
    {
      path: '/random-all',
      name: 'random-all',
      component: () => import('@/views/random-all.vue'),
      meta: {
        title: '指令列表',
      },
    },
  ],
})
export default router
