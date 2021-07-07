/*
    ## Address
*/

import { random } from 'lodash'
import { pick } from '../utils/helper'
import DICT from './address_dict'
const REGION = ['东北', '华北', '华东', '华中', '华南', '西南', '西北']

export default {
  // 随机生成一个大区。
  region: function () {
    return pick(REGION)
  },
  // 随机生成一个（中国）省（或直辖市、自治区、特别行政区）。
  province: function () {
    return pick(DICT).name
  },
  // 随机生成一个（中国）市。
  city: function (prefix = true) {
    var province = pick(DICT)
    var city = pick(province.children)
    return prefix ? [province.name, city.name].join(' ') : city.name
  },
  // 随机生成一个（中国）县。
  county: function (prefix = true) {
    var province = pick(DICT)
    var city = pick(province.children)
    var county = pick(city.children) || {
      name: '-',
    }
    return prefix ? [province.name, city.name, county.name].join(' ') : county.name
  },
  // 随机生成一个邮政编码（六位数字）。
  zip: function () {
    var zip = ''
    for (var i = 0; i < 6; i++) zip += random(0, 9)
    return zip
  },
}
