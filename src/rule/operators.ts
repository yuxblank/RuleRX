import {Value} from "./rule-api";

export function equal(object: any[], value:Value): Value{
  if (object.length === 1) {
    return object[0] === value;
  }
  return object.every(o => o === value);
}

export function greaterThan(object:number[], value: Value){
  if (object.length === 1) {
    return object[0] > value;
  }
  return object.every(o => o > value);
}
