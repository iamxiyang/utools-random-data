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

// 学校名称
export const school = () => {
  const suffix = ['大学', '交通大学', '工业大学', '理工大学', '科技大学', '化工大学', '工商大学', '服装学院', '建筑大学', '农业大学', '医科大学', '师范大学', '信息工程大学']
  return province().replace(/省|市|维吾尔自治区|自治区|回族|壮族/g, '') + sample(suffix)
}

// 快递地址
export const express = () => {
  // 地址、学校、姓名、电话、邮编随机顺序组合返回
  const arr = [`${address()} ${school()}  ${phone()} ${username()}`, `${username()} ${address()}  ${phone()}`, `${username()} ${phone()} ${address()} `]
  return sample(arr)
}
