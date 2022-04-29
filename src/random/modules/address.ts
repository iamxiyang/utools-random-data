import addressJson from './address.json'
import sample from 'lodash.sample'
import { phone, username } from './people'

interface IAddress {
  code: number
  name: string
  children?: IAddress[]
}

let caches: { [key: string]: IAddress } = {}

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
  const value: IAddress = sample(_province.children) as IAddress
  caches['city'] = value
  return value.name
}

export const county = () => {
  if (caches['county']) {
    return caches['county'].name
  }
  if (!caches['city']) {
    city()
  }
  const _city: IAddress = caches['city']
  const value: IAddress = sample(_city.children) as IAddress
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
  const value: IAddress = sample(_county.children) as IAddress
  caches['street'] = value
  return value.name
}

export const _clearAddressCaches = () => {
  caches = {}
}
// 邮编
export const postcode = () => {
  // 我国采用四级六位编码制，前两位表示省（直辖市,自治区），第三位代表邮区，第四位代表县（市），最后两位数字是代表从这个城市哪个投递区投递的，即投递区的位置。
  // TODO 暂时没考虑好怎么生成，最好能够和城市信息对应上
  return ''
}

// 小区
export const community = () => {
  const prefix = ['天下', '世纪', '龙湖', '高兴', '万乐', '智慧']
  const suffix = ['新村', '新花园', '小区', '广场', '中心', '家园']
  return (sample(prefix) as string) + sample(suffix)
}

// 学校名称
export const school = () => {
  return sample([
    '中国人民大学',
    '清华大学',
    '北京交通大学',
    '北京工业大学',
    '北京航空航天大学',
    '北京理工大学',
    '北京科技大学',
    '北方工业大学',
    '北京化工大学',
    '北京工商大学',
    '北京服装学院',
    '北京邮电大学',
    '北京印刷学院',
    '北京建筑大学',
    '北京石油化工学院',
    '北京电子科技学院',
    '中国农业大学',
    '北京农学院',
    '北京林业大学',
    '北京协和医学院',
    '北京大学',
    '河北大学',
    '河北工业大学',
    '河北科技大学',
    '河北农业大学',
    '河北医科大学',
    '河北师范大学',
    '中国人民公安大学',
    '中国人民大学',
    '中国政法大学',
    '中央民族大学',
    '华北电力大学',
    '华北理工大学',
    '华北师范大学',
    '华东师范大学',
    '郑州大学',
    '河南大学',
    '河南工业大学',
    '成都理工大学',
    '成都信息工程大学',
    '四川大学',
    '四川农业大学',
  ])
}

// 快递地址
export const express = () => {
  // 地址、学校、姓名、电话、邮编随机顺序组合返回
  const arr = [`${address()} ${school()} ${postcode()} ${phone()} ${username()}`, `${username()} ${address()} ${postcode()} ${phone()}`, `${username()} ${phone()} ${address()} ${postcode()}`]
  return sample(arr)
}
