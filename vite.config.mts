import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import UnoCSS from 'unocss/vite'
import presetWind from '@unocss/preset-wind'
import { createPreloadPlugin } from 'vite-plugin-utools-helper'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    target: 'es2019',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      routesFolder: 'src/views',
      dts: './src/types/typed-router.d.ts',
      exclude: ['_*'],
    }),
    vue(),
    AutoImport({
      dts: './src/types/auto-imports.d.ts',
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: ['vue', VueRouterAutoImports, 'pinia'],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: './src/types/components.d.ts',
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
      resolvers: [ElementPlusResolver()],
    }),
    UnoCSS({
      presets: [presetWind()],
    }),
    // preload打包
    createPreloadPlugin({}),
  ],
  server: {
    port: 5175,
    hmr: {
      overlay: false,
    },
    warmup: {
      clientFiles: ['./src/App.vue', './src/views/_layout.vue', './src/views/commands/random-all.vue'],
    },
  },
})
