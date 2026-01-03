import fs from 'fs'

export const saveFile = async (filePath: string, buffer: any): Promise<boolean> => {
  await fs.promises.writeFile(filePath, buffer)
  return true
}

export const readFile = async (filePath: string): Promise<string> => {
  return fs.promises.readFile(filePath, { encoding: 'utf-8' })
}

// 捕获初次进入的数据，供 main.ts 加载慢时读取
utools.onPluginEnter((res: any) => {
  (window as any)._utools_entry = res
})