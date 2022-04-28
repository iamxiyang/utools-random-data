import { cloneDeep } from 'lodash'
import { defineStore } from 'pinia'
import defaultFeatures from '../constant/defaultFeature'

export default defineStore('app', {
  state: () => {
    return {
      features: (window.utools ? utools.db.allDocs('cmd-') : cloneDeep(defaultFeatures)) as DbDoc[],
    }
  },
  actions: {
    async init() {
      const data: DbDoc[] = window.utools ? utools.db.allDocs('cmd-') : cloneDeep(defaultFeatures)
      if (data.length) {
        this.features = data
      }
    },
  },
})
