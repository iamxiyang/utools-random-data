import sample from 'lodash.sample'
import random from 'lodash.random'

export const rgb = () => {
  return `rgb(${random(255)},${random(255)},${random(255)})`
}

export const rgba = () => {
  return `rgba(${random(255)},${random(255)},${random(255)},${random(1)})`
}

export const hsl = () => {
  return `hsl(${random(360)},${random(100)}%,${random(100)}%)`
}

export const hsla = () => {
  return `hsla(${random(360)},${random(100)}%,${random(100)}%,${random(1)})`
}

export const hex = () => {
  return `#${random(0xffffff).toString(16)}`
}

export const color = () => {
  const arr = [rgb(), rgba(), hsl(), hsla(), hex()]
  return sample(arr)
}
