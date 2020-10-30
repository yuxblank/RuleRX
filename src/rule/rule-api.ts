import {Observable} from "rxjs";

export interface Rule<T> {
  path: string;
  operator: Operator<T>;
  value: Value;
  fact: string;
}

export interface EvaluatedRule<T> {
  value: any;
  fact: string;
  element: T;
}


export type Value = any[] | boolean | number | string;

export type Operator<T> = (object: T[] | Value[], value:Value) => Value;

export interface RuleEvaluator<T> {
  evaluate<K>(rules:Rule<T>[], ...obj : Observable<T>[]):Observable<EvaluatedRule<T>[]>
}
