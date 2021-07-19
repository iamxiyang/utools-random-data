import { defineConfig } from 'umi';

export default defineConfig({
  title: '随机生成虚拟数据',
  history: {
    type: 'hash',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  copy: [
    {
      from: 'src/plugin.json',
      to: 'plugin.json',
    },
    {
      from: 'src/static',
      to: 'static',
    },
  ],
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
});
