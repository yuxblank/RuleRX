import {
  EvaluatedRule,
  Operator,
  Result,
  Rule,
  RuleEvaluator,
  RuleEvaluatorContainer,
  RuleSet
} from './rule-api'
import { Observable, of, zip } from 'rxjs'
import { JSONPath } from 'jsonpath-plus'
import { map, mergeAll } from 'rxjs/operators'

export class RuleRx<T> implements RuleEvaluator<T> {
  constructor(private container?: RuleEvaluatorContainer) {}

  evaluate(rules: RuleSet<T>[] | string, ...contexts: Observable<T>[]): Observable<Result<T>[]> {
    return zip(...contexts).pipe(
      map((obs: any) => {
        let ruleSet: RuleSet<T>[]
        if (this.container && typeof rules === 'string') {
          ruleSet = this.container.getRuleConfiguration(rules)
        } else {
          ruleSet = rules as RuleSet<T>[]
        }
        return this.evaluateRules(ruleSet, obs)
      })
    )
  }

  private evaluateRules(rules: RuleSet<T>[], contexts: T[]): Result<T>[] {
    let op: Result<T>[] = []
    rules.forEach(rule => {
      if (rule.all) {
        contexts.forEach(context => {
          // @ts-ignore
          let evaluateRule = this.evaluateRulesOnContext(rule.all, context)
          if (evaluateRule.every(r => r.value)) {
            op.push({
              element: context,
              rules: evaluateRule
            })
          }
        })
      }

      if (rule.any) {
        contexts.map(context => {
          // @ts-ignore
          let evaluateRule = this.evaluateRulesOnContext(rule.any, context)
          if (evaluateRule.some(r => r.value)) {
            op.push({
              element: context,
              rules: evaluateRule
            })
          }
        })
      }

      if (rule.none) {
        contexts.forEach(context => {
          // @ts-ignore
          let evaluateRule = this.evaluateRulesOnContext(rule.none, context)
          if (evaluateRule.every(r => !r.value)) {
            op.push({
              element: context,
              rules: evaluateRule
            })
          }
        })
      }
    })
    return op
  }

  private getOperator(rule: Rule<T>): Operator<T> {
    if (this.container && typeof rule.operator === 'string') {
      return this.container.getOperator(rule.operator)
    }
    return rule.operator as Operator<T>
  }

  private evaluateRulesOnContext(rules: Rule<T>[], context: T): EvaluatedRule<T>[] {
    return rules.map(rule => {
      let scope = JSONPath({
        path: rule.path,
        json: context as any
      })
      return {
        fact: rule.fact,
        value: this.getOperator(rule)(scope, rule.value),
        element: context
      }
    })
  }
}
