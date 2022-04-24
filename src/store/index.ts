import { defineStore } from 'pinia'
import defaultFeatures from '../constant/defaultFeature'

export default defineStore('app', {
  state: () => {
    return {
      features: window.utools ? (utools.db.allDocs('cmd-') as DbFeature[]) : defaultFeatures,
      deleteId: '',
    }
  },
  actions: {
    async init() {
      const data: DbFeature[] = window.utools ? (utools.db.allDocs('cmd-') as DbFeature[]) : defaultFeatures
      if (data.length) {
        this.features = data
      }
    },
  },
})
