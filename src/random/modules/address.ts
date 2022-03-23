import addressJson from './address.json'
import sample from 'lodash.sample'
import { phone, username } from './people'
// @地址（约等于 省市县+街道 +小区）
// @省
// @市
// @县
// @街道 （随机数据，不代表真实存在）
// @小区 （随机数据，不代表真实存在）
// @邮编 （会按顺序尽可能和县、市进行匹配，如果无法匹配则随机）
// >> 如果市县紧跟前一级数据，则自动是子数据。比如@省@市，如果@省的随机结果是河南省，则@市必定是河南下的城市。而单独写@市，则可能是全国任意城市。

// @学校
// @姓名
// @姓名（中文、英文）

interface IAddress {
  code: number
  name: string
  children?: IAddress[]
}

// @快递信息（约等于 地址、邮编、电话/手机号、姓名 的随机组合）
const caches: { [key: string]: IAddress } = {}

export const address = () => {
  return province() + city() + county() + street()
}

export const province = () => {
  if (caches['province']) {
    return caches['province'].name
  }
  const value: IAddress = sample(addressJson) as any
  caches['province'] = value
  return value.name
}
export const city = () => {
  if (caches['city']) {
    return caches['city'].name
  }
  if (!caches['province']) {
    province()
  }
  const _province: IAddress = caches['province']
  const value: IAddress = sample(_province.children) as any
  caches['city'] = value
  return value.name
}

// 2省 4市 6县、区 9街道、乡镇
export const county = () => {
  if (caches['county']) {
    return caches['county'].name
  }
  if (!caches['city']) {
    city()
  }
  const _city: IAddress = caches['city']
  const value: IAddress = sample(_city.children) as any
  caches['county'] = value
  return value.name
}
export const street = () => {
  if (caches['street']) {
    return caches['street'].name
  }
  if (!caches['county']) {
    county()
  }
  const _county: IAddress = caches['county']
  const value: IAddress = sample(_county.children) as any
  caches['street'] = value
  return value.name
}
// 邮编
export const postcode = () => {
  // 我国采用四级六位编码制，前两位表示省（直辖市、自治区），第三位代表邮区，第四位代表县（市），最后两位数字是代表从这个城市哪个投递区投递的，即投递区的位置。
  return ''
}

// 小区
export const community = () => {
  // 随机生成小区名称
  return ''
}
// 学校名称
export const school = () => {
  return sample(['北京大学', '清华大学', '北京航空航天大学', '北京理工大学', '北京师范大学', '北京科技大学', '北京科技大学', '北京理工大学', '北京信息科技大学', '北京中医药大学', '郑州大学', '河南大学', '河南工业大学', '成都理工大学', '成都信息工程大学', '四川大学', '四川农业大学'])
}

// 快递地址
export const express = () => {
  const arr = [`${address()} ${school()} ${postcode()} ${phone()} ${username()}`, `${username()} ${address()} ${postcode()} ${phone()}`, `${username()} ${phone()} ${address()} ${postcode()}`]
  return sample(arr)
}
