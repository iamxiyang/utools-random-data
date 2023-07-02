const { VM } = require('vm2')

const sandbox = {
  // 注入到沙箱的一些方法，便于使用
  _dayjs: require('dayjs'),
  _clonedeep: require('lodash.clonedeep'),
  _isequal: require('lodash.isequal'),
  _random: require('lodash.random'),
  _sample: require('lodash.sample'),
  _times: require('lodash.times'),
}

const vm = new VM({
  timeout: 3000,
  allowAsync: false,
  sandbox,
  eval: false,
  wasm: false,
})

// 测试阶段，函数运行时间不能超过1秒
const testVm = new VM({
  timeout: 1000,
  allowAsync: false,
  sandbox,
  eval: false,
  wasm: false,
})

export function evaluate(code: string, isTest: boolean = false) {
  if (isTest) {
    return testVm.run(code)
  }
  return vm.run(code)
}
