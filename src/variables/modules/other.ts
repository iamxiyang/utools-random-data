import dayjs from 'dayjs'
import sample from 'lodash.sample'
import { city, province } from './address'
import { useRegexp } from './regexp'

export const UUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const date = (format: string = 'YYYY-MM-DD') => {
  // 随机时间戳
  const randomTimestamp = Math.floor(Math.random() * (new Date().getTime() - 1000000000000)) + 1000000000000
  return dayjs(randomTimestamp).format(format)
}

// 车牌号
export const carNumber = (newEnergy: boolean = false) => {
  // 部分城市的简称
  const provinces = ['京', '津', '冀', '浙', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '川', '贵', '新']
  // 英文字母
  const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const number = `${sample(provinces)}${sample(letter)}${UUID().toUpperCase()}`
  return newEnergy ? number.substring(0, 8) : number.substring(0, 7)
}

// 随机生成公司名称
export const companyName = () => {
  // 参考：https://zhuanlan.zhihu.com/p/335732499
  // 企业名称=行政区划+字号+行业+组织形式（将“行政区划”括起来插到中间亦可）。
  const industry = ['餐饮', '宾馆', '房地产', '服务', '教育', '培训', '计算机', '会计', '美容', '咨询']
  const organizationalForm = ['有限责任公司', '有限公司', '股份有限公司', '普通合伙']
  const shopName = useRegexp(
    /[霆晓衡儒静丽韵耀艺巍兰雪尧谊影慧洁润成翔隆东森迪赛睿艾高德雅格纳欣亿维锐菲佳沃晟捷乐飞福皇嘉达佰美元亮名欧特辰康讯鹏腾宏伟钧思正博扬索蓝昂兴聚鸿略众汇圣卓宇国普绿斯登诺恒辉缘旺融誉际巨骄为诚妙英虹芬馨尼迈群拓建江雷天策优聪垒蕾瀚骁永吉先君依昌哲营梦瑜菏凤叶卫易威玛日伦道发唯一才月丹文立玉平同志宜林奇政朋诗香鼎碧麦邦克凡利卡多安尚川州帝悦情明滋祥逸风致春帅盈泓品庭展朔轩育航津启振聆翌迎常浩茗杰智婷越岚超清云淼业义意资湘会菁萌语荣赫宁铭齐毅进臻燕霖霏莲灿颜麒韬露鹤骄厅湾凡可巧弘禾竹多帆秀贝仑青笑宗雨虹纪亭俊禹垚秋倩宸甜加茜涵琳微菡萱金新中盛亚信华豪奥凯泰鑫创宝星联晨百尔海瑞科锦彩朗郎爱景帆阳驰通骏力顺领迅途益和园波丰壹泽]{2,6}/,
  )
  const arr = [
    // 省+字号+行业+组织形式
    `${province()}${shopName}${sample(industry)}${sample(organizationalForm)}`,
    // 市+字号+行业+组织形式
    `${city()}${shopName}${sample(industry)}${sample(organizationalForm)}`,
    // 字号+行业+省+组织形式
    `${shopName}${sample(industry)}(${province()})${sample(organizationalForm)}`,
  ]
  return sample(arr)
}

export const mac = () => {
  return `${useRegexp(/([A-F0-9]{2})/g)}:${useRegexp(/([A-F0-9]{2})/g)}:${useRegexp(/([A-F0-9]{2})/g)}:${useRegexp(/([A-F0-9]{2})/g)}:${useRegexp(/([A-F0-9]{2})/g)}:${useRegexp(/([A-F0-9]{2})/g)}`
}
