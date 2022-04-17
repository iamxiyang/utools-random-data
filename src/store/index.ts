import { defineStore } from 'pinia'

const appStore = defineStore('index', {
  state: () => ({
    baseUrl: 'https://www.baidu.com/',
    cmdList: [],
  }),
  actions: {
    changeState(params: any) {
      // console.log('接收到的参数===>', params)
      this.baseUrl = params
    },
  },
})

export default appStore
