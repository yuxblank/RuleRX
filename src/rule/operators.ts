import {Value} from "./rule-api";


export function equal(object: any[], value:Value): boolean{
  return isSingular(object) ? object[0] === value : object.every(o => o === value);
}

export function greaterThan(object:any[], value: Value): boolean{
  return isSingular(object) ? object[0] > value : object.every(o => o > value);
}
export function greaterOrEqThan(object:any[], value: Value): boolean{
  return isSingular(object) ? object[0] >= value : object.every(o => o >= value);
}

export function anyOf(object:any[], value: any[]) {
  return object.some(val => {
    return value.indexOf(val) > -1;
  })
}



function isSingular(el: any[]):boolean{
  return el.length === 0;
}
