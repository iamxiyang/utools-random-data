import { random } from '../utils/helper'

var schoolArr = require('./school.json')

// 高等院校名单来源：http://www.moe.gov.cn/srcsite/A03/moe_634/201706/t20170614_306900.html

const school = () => {
  return schoolArr[random(0, schoolArr.length - 1)]
}

export default { school }
