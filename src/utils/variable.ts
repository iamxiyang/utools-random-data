import dayjs from 'dayjs'
import clonedeep from 'lodash.clonedeep'
import isequal from 'lodash.isequal'
import random from 'lodash.random'
import sample from 'lodash.sample'
import times from 'lodash.times'

export function evaluate(code: string, isTest: boolean = false) {
  const sandbox = {
    console: {
      log: console.log,
      error: console.error,
    },
    window: {},
    document: {},
    _dayjs: dayjs,
    _clonedeep: clonedeep,
    _isequal: isequal,
    _random: random,
    _sample: sample,
    _times: times,
  }

  // const fn = new Function(
  //   Object.keys(sandbox).join(','),
  //   `(async function(){
  //   try {
  //     ${code}
  //   } catch(error) {
  //     console.error(error);
  //   }
  // })()`,
  // )

  if (isTest) {
    const fn = new Function(Object.keys(sandbox).join(','), code)
    return fn(...Object.values(sandbox))
  }

  try {
    const fn = new Function(Object.keys(sandbox).join(','), code)
    return fn(...Object.values(sandbox))
  } catch (err) {
    console.error(err)
  }
}
