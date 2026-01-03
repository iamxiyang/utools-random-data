// @ts-ignore - reregexp 的类型定义不完整
import ReRegExpModule from 'reregexp'

// 处理 ESM 和 CJS 导入差异
const ReRegExp = (ReRegExpModule as any).default || ReRegExpModule

// 根据正则生成内容
export const useRegexp = (text: RegExp) => {
  if (!text) return ''
  try {
    const r1 = new ReRegExp(text)
    return r1.build()
  } catch (err) {
    console.error('useRegexp error:', err)
    return ''
  }
}
