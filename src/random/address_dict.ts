/*
    ## Address 字典数据

    字典数据来源 http://www.atatech.org/articles/30028?rnd=254259856

    国标 省（市）级行政区划码表

    华北   北京市 天津市 河北省 山西省 内蒙古自治区
    东北   辽宁省 吉林省 黑龙江省
    华东   上海市 江苏省 浙江省 安徽省 福建省 江西省 山东省
    华南   广东省 广西壮族自治区 海南省
    华中   河南省 湖北省 湖南省
    西南   重庆市 四川省 贵州省 云南省 西藏自治区
    西北   陕西省 甘肃省 青海省 宁夏回族自治区 新疆维吾尔自治区
    港澳台 香港特别行政区 澳门特别行政区 台湾省
    
    **排序**
    
    ```js
    var map = {}
    _.each(_.keys(REGIONS),function(id){
      map[id] = REGIONS[ID]
    })
    JSON.stringify(map)
    ```
*/
var DICT = require('./address_dict.json')

// id pid/parentId name children
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

var DICT_FIXED = (function () {
  var fixed = []
  for (var id in DICT) {
    var pid = id.slice(2, 6) === '0000' ? undefined : id.slice(4, 6) == '00' ? id.slice(0, 2) + '0000' : id.slice(0, 4) + '00'
    fixed.push({
      id: id,
      pid: pid,
      name: DICT[id],
    })
  }
  return tree(fixed)
})()

export default DICT_FIXED
