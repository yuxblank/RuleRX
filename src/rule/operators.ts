import { Value } from './rule-api'
import * as _ from 'lodash'

export function equal(object: any[], value: Value): boolean {
  return object.every(o => o === value)
}

export function greaterThan(object: any[], value: Value): boolean {
  return object.every(o => o > value)
}

export function lessThan(object: any[], value: Value): boolean {
  return object.every(o => o < value)
}

export function greaterOrEqThan(object: any[], value: Value): boolean {
  return object.every(o => o >= value)
}

export function lessOrEqThan(object: any[], value: Value): boolean {
  return object.every(o => o <= value)
}

export function allOf(object: any[], value: any[]): boolean {
  return object.every(val => {
    return value.indexOf(val) > -1
  })
}
export function anyOf(object: any[], value: any[]): boolean {
  return object.some(val => {
    return value.indexOf(val) > -1
  })
}
export function noneOf(object: any[], value: any[]): boolean {
  return (
    object.filter(val => {
      return value.indexOf(val) > -1
    }).length === 0
  )
}

export function anyOfList(object: any[], value: any[]): boolean {
  return (
    object.filter(f =>
      f.every((val: any) => {
        return value.indexOf(val) > -1
      })
    ).length > 0
  )
}

export function allOfList(object: any[], value: any[]): boolean {
  return _.isEqual(_.flatten(object), value)
}

export function noneOfList(object: any[], value: any[]): boolean {
  return (
    object.filter(f =>
      f.every((val: any) => {
        return value.indexOf(val) === -1
      })
    ).length === object.length
  )
}
