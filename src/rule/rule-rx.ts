import { EvaluatedRule, Result, Rule, RuleEvaluator, RuleSet } from './rule-api'
import { Observable, of, zip } from 'rxjs'
import { JSONPath } from 'jsonpath-plus'
import { map, mergeAll } from 'rxjs/operators'

export class RuleRx<T> implements RuleEvaluator<T> {
  evaluate(rules: RuleSet<T>, ...contexts: Observable<T>[]): Observable<Result<T>[]> {
    return zip(...contexts).pipe(
      map((obs: any) => {
        return this.evaluateRules(rules, obs)
      })
    )
  }

  private evaluateRules(rules: RuleSet<T>, contexts: T[]): Result<T>[] {
    let op: Result<T>[] = []

    if (rules.all) {
      contexts.forEach(context => {
        // @ts-ignore
        let evaluateRule = this.evaluateRulesOnContext(rules.all, context)
        if (evaluateRule.every(r => r.value)) {
          op.push({
            element: context,
            rules: evaluateRule
          })
        }
      0})
    }

    if (rules.any) {
      contexts.map(context => {
        // @ts-ignore
        let evaluateRule = this.evaluateRulesOnContext(rules.any, context)
        if (evaluateRule.some(r => r.value)) {
          op.push({
            element: context,
            rules: evaluateRule
          })
        }
      })
    }

    if (rules.none) {
      contexts.forEach(context => {
        // @ts-ignore
        let evaluateRule = this.evaluateRulesOnContext(rules.none, context)
        if (evaluateRule.every(r => !r.value)) {
          op.push({
            element: context,
            rules: evaluateRule
          })
        }
      })
    }
    return op
  }

  private evaluateRulesOnContext(rules: Rule<T>[], context: T): EvaluatedRule<T>[] {
    return rules.map(rule => {
      let scope = JSONPath({
        path: rule.path,
        json: context as any
      })
      return {
        fact: rule.fact,
        value: rule.operator(scope, rule.value),
        element: context
      }
    })
  }
}
