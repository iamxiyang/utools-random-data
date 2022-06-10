import { defineStore } from 'pinia'
import cloneDeep from 'lodash.clonedeep'
import defaultFeatures from '../constant/defaultFeature'

export default defineStore('app', {
  state: () => {
    return {
      features: cloneDeep(defaultFeatures),
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
