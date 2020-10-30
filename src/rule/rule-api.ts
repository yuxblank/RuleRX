import {Observable} from "rxjs";

export interface Rule<T,K> {
  path: string;
  operator: Operator<T, K>;
  value: Value;
  fact: string;
}

export interface EvaluatedRule<T> {
  value: any;
  fact: string;
  element: T;
}


export type Value = any[] | boolean | number | string;

export type Operator<T,K> = (object: K[] | Value[], value:Value) => Value;

export interface RuleEvaluator<T> {
  evaluate<K>(rules:Rule<T,K>[], ...obj : Observable<T>[]):Observable<EvaluatedRule<T>[]>
}
