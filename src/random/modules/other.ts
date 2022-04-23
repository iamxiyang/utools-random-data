import sample from 'lodash.sample'

export const uuid = () => {
  // @ts-ignore
  return crypto.randomUUID()
}

// 车牌号
export const carNumber = (newEnergy: boolean = false) => {
  // 部分城市的简称
  const province = ['京', '津', '冀', '浙', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '川', '贵', '新']
  // 英文字母
  const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const number = `${sample(province)}${sample(letter)}${uuid().toUpperCase()}`
  return newEnergy ? number.substr(0, 8) : number.substr(0, 7)
}
