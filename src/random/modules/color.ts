import sample from 'lodash.sample'
import random from 'lodash.random'

const rgb = () => {
  return `rgb(${random(255)},${random(255)},${random(255)})`
}

const rgba = () => {
  return `rgba(${random(255)},${random(255)},${random(255)},${random(1)})`
}

const hsl = () => {
  return `hsl(${random(360)},${random(100)}%,${random(100)}%)`
}

const hsla = () => {
  return `hsla(${random(360)},${random(100)}%,${random(100)}%,${random(1)})`
}

const hex = () => {
  return `#${random(0xffffff).toString(16)}`
}

export const color = (type: 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hex' | undefined = undefined) => {
  const arr = [rgb(), rgba(), hsl(), hsla(), hex()]
  const obj = {
    rgb: arr[0],
    rgba: arr[1],
    hsl: arr[2],
    hsla: arr[3],
    hex: arr[4],
  }
  return type && obj[type] ? obj[type] : sample(arr)
}
