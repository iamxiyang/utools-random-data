import fs from 'fs'

export const saveFile = async (filePath: string, buffer: any): Promise<boolean> => {
  await fs.promises.writeFile(filePath, buffer)
  return true
}

export const readFile = async (filePath: string): Promise<string> => {
  return fs.promises.readFile(filePath, { encoding: 'utf-8' })
}
