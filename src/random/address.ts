import { pick, random } from '../utils/helper'
const REGION = ['东北', '华北', '华东', '华中', '华南', '西南', '西北']

var DICT2 = require('./address_dict.json')

function tree(list) {
  var mapped = {}
  for (var i = 0, item; i < list.length; i++) {
    item = list[i]
    if (!item || !item.id) continue
    mapped[item.id] = item
  }

  var result = []
  for (var ii = 0; ii < list.length; ii++) {
    item = list[ii]

    if (!item) continue
    /* jshint -W041 */
    if (item.pid == undefined && item.parentId == undefined) {
      result.push(item)
      continue
    }
    var parent = mapped[item.pid] || mapped[item.parentId]
    if (!parent) continue
    if (!parent.children) parent.children = []
    parent.children.push(item)
  }
  return result
}

var DICT = (function () {
  var fixed = []
  for (var id in DICT2) {
    var pid = id.slice(2, 6) === '0000' ? undefined : id.slice(4, 6) == '00' ? id.slice(0, 2) + '0000' : id.slice(0, 4) + '00'
    fixed.push({
      id: id,
      pid: pid,
      name: DICT2[id],
    })
  }
  return tree(fixed)
})()


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

  // TODO 可以考虑随机生成 xx路xx号
}
