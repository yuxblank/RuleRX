import {EvaluatedRule, Rule, RuleEvaluator, Value} from "./rule-api";
import {Observable, of} from "rxjs";
import {JSONPath} from "jsonpath-plus"
import {map, mergeMap} from "rxjs/operators";
import {flatMap} from "rxjs/internal/operators";

export class RuleRx<T> implements RuleEvaluator<T> {
  evaluate(rules: Rule<T>[], ...obj: Observable<T>[]): Observable<EvaluatedRule<T>[]> {

    return of(...obj).pipe(
      flatMap(obs => {
      return obs.pipe(
          map(value => {
            return this.evaluateRules(rules, value);
          })
        )
      })
    );
  }

  private evaluateRules(rules: Rule<T>[], value: T): EvaluatedRule<T>[] {
    return rules.map(
      rule => {
        let scope = JSONPath({
          path: rule.path,
          json: <any>value
        });
        return {
          fact: rule.fact,
          value: rule.operator(scope, rule.value),
          element: scope
        }
      }
    )

  }

}
