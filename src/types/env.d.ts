/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />
/// <reference types="unplugin-vue-router/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

export {}
