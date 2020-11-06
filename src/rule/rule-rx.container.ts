import { Operator, RuleConfiguration, RuleEvaluatorContainer, RuleSet } from './rule-api'
import {
  allOf,
  allOfList,
  anyOf,
  anyOfList,
  equal,
  greaterOrEqThan,
  greaterThan,
  lessOrEqThan,
  lessThan,
  noneOf,
  noneOfList,
  sumGreaterThan
} from './operators'

export class RuleRxContainer implements RuleEvaluatorContainer {
  private readonly operators: Map<string, Operator<any>> = new Map<string, Operator<any>>()
  private readonly ruleConfigurations: Map<string, RuleConfiguration<any>> = new Map<
    string,
    RuleConfiguration<any>
  >()

  constructor(
    operators: Map<string, Operator<any>>,
    ruleConfigurations: Map<string, RuleConfiguration<any>>
  ) {
    this.operators = operators
    this.ruleConfigurations = ruleConfigurations
  }

  addOperator<T>(name: string, operator: Operator<T>): void {
    this.operators.set(name, operator)
  }

  addRuleConfiguration<T>(config: RuleConfiguration<T>): void {
    this.ruleConfigurations.set(config.name, config)
  }

  getOperator<T>(name: string): Operator<T> {
    if (!this.operators.has(name)) {
      throw new RuleEvaluatorContainerException(`operator ${name} is not registered`)
    }
    // @ts-ignore
    return this.operators.get(name)
  }

  getRuleConfiguration(name: string): RuleSet<any>[] {
    if (!this.ruleConfigurations.has(name)) {
      throw new RuleEvaluatorContainerException(`rule ${name} is not registered`)
    }
    // @ts-ignore
    return this.ruleConfigurations.get(name).rules
  }
}

export const RuleRxContainerFactory = () => {
  const operators: Map<string, Operator<any>> = new Map<string, Operator<any>>()
  operators.set('equal', equal)
  operators.set('greaterThan', greaterThan)
  operators.set('lessThan', lessThan)
  operators.set('greaterOrEqThan', greaterOrEqThan)
  operators.set('lessOrEqThan', lessOrEqThan)
  operators.set('allOf', allOf)
  operators.set('anyOf', anyOf)
  operators.set('noneOf', noneOf)
  operators.set('anyOfList', anyOfList)
  operators.set('allOfList', allOfList)
  operators.set('noneOfList', noneOfList)
  operators.set('sumGreaterThan', sumGreaterThan)
  return new RuleRxContainer(operators, new Map<string, RuleConfiguration<any>>())
}

export class RuleEvaluatorContainerException extends Error {
  constructor(message: string) {
    super(message)
  }
}
