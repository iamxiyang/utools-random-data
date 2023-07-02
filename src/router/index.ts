import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto/routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '',
      component: () => import('../views/_layout.vue'),
      children: routes,
    },
  ],
})

export default router
