import { defineStore } from 'pinia'
import variables from '../variables'

interface AppStore {
  variables: DbVariables[]
  commands: DbCommands[]
}

const systemVariables = Object.keys(variables).map((name) => {
  const { example, explain, fun } = variables[name]
  return {
    fun,
    name,
    example,
    explain,
  }
}) as (SystemVariables & { name: string })[]

export const useAppStore = defineStore('app', {
  state: (): AppStore => {
    return {
      variables: [],
      commands: [],
    }
  },
  getters: {
    systemVariables() {
      return systemVariables
    },
    allVariables(state) {
      // 系统变量包含 fun，但不包含 code
      const variables = state.variables.map((row) => {
        return {
          ...row.data,
          _id: row._id,
        }
      })
      return [...variables, ...systemVariables]
    },
    allVariablesName(state) {
      const systemName = systemVariables.map((item) => {
        return item.name
      })
      const variablesName = state.variables.map((item) => {
        return item.data.name
      })
      return [...variablesName, ...systemName].filter((item) => item)
    },
    allVariablesObject(): Record<string, Variables | SystemVariables> {
      return this.allVariables.reduce((prev, next) => {
        prev[`\${${next.name}}`] = next
        return prev
      }, {} as Record<string, Variables | SystemVariables>)
    },
  },
})
