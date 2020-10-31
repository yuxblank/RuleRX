import {Value} from "./rule-api";


export function equal(object: any[], value:Value): boolean{
  return  object.every(o => o === value);
}

export function greaterThan(object:any[], value: Value): boolean{
  return object.every(o => o > value);
}
export function greaterOrEqThan(object:any[], value: Value): boolean{
  return  object.every(o => o >= value);
}
export function lessOrEqThan(object:any[], value: Value): boolean{
  return object.every(o => o <= value);
}

export function anyOf(object:any[], value: any[]) {
  return object.some(val => {
    return value.indexOf(val) > -1;
  })
}
