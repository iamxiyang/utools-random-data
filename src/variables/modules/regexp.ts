import ReRegExp from 'reregexp';

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
