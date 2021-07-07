import { random } from 'lodash'

// 从数组中随机选取一个元素，并返回。
export const pick = (arr) => {
  if (!Array.isArray(arr)) {
    return
  }
  return arr[random(arr.length - 1)]
}
