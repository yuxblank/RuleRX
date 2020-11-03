import { Observable } from 'rxjs'

export interface Rule<T> {
  path: string
  operator: Operator<T> | string
  value: Value
  fact: string
}

export interface EvaluatedRule<T> {
  value: boolean
  fact: string
  element: T
}

export interface Result<T> {
  rules: EvaluatedRule<T>[]
  element: T
}

export type Value = any[] | boolean | number | string

export interface RuleSet<T> {
  any?: Rule<T>[]
  all?: Rule<T>[]
  none?: Rule<T>[]
}

export type Operator<T> = (object: T[] | Value[], value: Value | any) => boolean

export interface RuleEvaluator<T> {
  evaluate<K>(rules: RuleSet<T> | string, ...obj: Observable<T>[]): Observable<Result<T>[]>
}

export interface RuleConfiguration<T> {
  name: string
  rules: RuleSet<T>
}

export interface RuleEvaluatorContainer {
  addRuleConfiguration<T>(config: RuleConfiguration<T>): void
  getRuleConfiguration(name: string): RuleSet<any>
  addOperator<T>(name: string, operator: Operator<T>): void
  getOperator<T>(name: string): Operator<T>
}

export class RuleEvaluatorContainerException extends Error {
  constructor(message: string) {
    super(message)
  }
}
