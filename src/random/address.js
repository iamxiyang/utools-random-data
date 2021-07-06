"use strict";
/*
    ## Address
*/
exports.__esModule = true;
var address_dict_1 = require("./address_dict");
var REGION = ['东北', '华北', '华东', '华中', '华南', '西南', '西北'];
// 从数组中随机选取一个元素，并返回。
function pick(arr, min, max) {
    // pick( item1, item2 ... )
    if (!Array.isArray(arr)) {
        arr = [].slice.call(arguments);
        min = 1;
        max = 1;
    }
    else {
        // pick( [ item1, item2 ... ] )
        if (min === undefined)
            min = 1;
        // pick( [ item1, item2 ... ], count )
        if (max === undefined)
            max = min;
    }
    if (min === 1 && max === 1)
        return arr[0];
    // pick( [ item1, item2 ... ], min, max )
    return 0;
    // 通过参数个数判断方法签名，扩展性太差！#90
    // switch (arguments.length) {
    // 	case 1:
    // 		// pick( [ item1, item2 ... ] )
    // 		return arr[this.natural(0, arr.length - 1)]
    // 	case 2:
    // 		// pick( [ item1, item2 ... ], count )
    // 		max = min
    // 			/* falls through */
    // 	case 3:
    // 		// pick( [ item1, item2 ... ], min, max )
    // 		return this.shuffle(arr, min, max)
    // }
}
exports["default"] = {
    // 随机生成一个大区。
    region: function () {
        return pick(REGION);
    },
    // 随机生成一个（中国）省（或直辖市、自治区、特别行政区）。
    province: function () {
        return pick(address_dict_1["default"]).name;
    },
    // 随机生成一个（中国）市。
    city: function (prefix) {
        var province = this.pick(address_dict_1["default"]);
        var city = this.pick(province.children);
        return prefix ? [province.name, city.name].join(' ') : city.name;
    },
    // 随机生成一个（中国）县。
    county: function (prefix) {
        var province = pick(address_dict_1["default"]);
        var city = pick(province.children);
        var county = pick(city.children) || {
            name: '-'
        };
        return prefix ? [province.name, city.name, county.name].join(' ') : county.name;
    }
};
