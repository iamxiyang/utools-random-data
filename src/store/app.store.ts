import { defineStore } from 'pinia'
import variables from '../variables'

interface AppStore {
  variables: DbVariables[]
  commands: DbCommands[]
}

interface SystemVariables {
  fun: Function
  name: string
  example: string
  description: string
}

const systemVariables = Object.keys(variables).map((name) => {
  const { example, description, fun } = variables[name]
  return {
    fun,
    name,
    example,
    description,
  }
}) as SystemVariables[]

export const useAppStore = defineStore('app', {
  state: (): AppStore => {
    return {
      variables: [],
      commands: [],
    }
  },
  getters: {
    // allCommandsName(state) {
    //   return state.commands.map((item) => item.data.explain)
    // },
    allVariablesName(state) {
      // TODO 需要有对应的 id
      return ([...systemVariables, ...state.variables] as (DbVariables & SystemVariables)[]).map((item) => {
        if (item.name) {
          return item.name
        }
        return item._id.replace('vars-', '')
      })
    },
    systemVariables() {
      return [...systemVariables]
    },
    allVariables(state) {
      // 系统变量包含 fun，但不包含 code
      const variables = [...state.variables].map(({ data }) => {
        return { name: data.name, code: data.code }
      })
      return [...systemVariables, ...variables]
    },
  },
})
