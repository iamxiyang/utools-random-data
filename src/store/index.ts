import { defineStore } from 'pinia'
import defaultFeatures from '@/constant/defaultFeature'

export default defineStore('app', {
  state: () => {
    return {
      features: window.utools ? (utools.db.allDocs('cmd-') as DbFeature[]) : defaultFeatures,
      delete: '',
    }
  },
  actions: {},
})
