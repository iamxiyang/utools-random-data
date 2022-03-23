import ReRegExp from 'reregexp'

// 根据正则生成内容，测试阶段
export const useRegexp = (text: RegExp) => {
  if (!text) return ''
  const r1 = new ReRegExp(text)
  return r1.build()
}
