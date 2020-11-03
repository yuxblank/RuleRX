import { RuleRx } from '../src/rule/rule-rx'
import { anyOf, equal, greaterOrEqThan, greaterThan, lessOrEqThan } from '../src/rule/operators'
import { BehaviorSubject, of } from 'rxjs'
import { concatMap, filter, finalize, flatMap, map, mergeAll, mergeMap, tap } from 'rxjs/operators'
import { RuleRxContainerFactory } from '../src/rule/rule-rx.container'

describe('RuleRX with json Rules', () => {
  it('RuleRX can resolve operators as string when registered to a container', done => {
    new RuleRx<{ name: string; surname: string }>(RuleRxContainerFactory())
      .evaluate(
        {
          all: [
            {
              fact: 'name is equal to jhon',
              operator: 'equal',
              path: '$.name',
              value: 'Jhon'
            },
            {
              fact: 'surname is equal to Doe',
              operator: 'equal',
              path: '$.surname',
              value: 'Doe'
            }
          ]
        },
        of({ name: 'Jhon', surname: 'Doe' }, { name: 'Jhon', surname: 'Frank' })
      )
      .pipe(mergeMap(p => p))
      .subscribe(next => {
        expect(next.element.surname).toEqual('Doe')
        done()
      })
  })

  it('RuleRX can use rule set by string name when registered to a container', done => {
    let ruleRxContainer = RuleRxContainerFactory()

    ruleRxContainer.addRuleConfiguration({
      name: 'ExampleRule',
      rules: {
        all: [
          {
            fact: 'name is equal to jhon',
            operator: 'equal',
            path: '$.name',
            value: 'Jhon'
          },
          {
            fact: 'surname is equal to Doe',
            operator: 'equal',
            path: '$.surname',
            value: 'Doe'
          }
        ]
      }
    })

    new RuleRx<{ name: string; surname: string }>(ruleRxContainer)
      .evaluate(
        'ExampleRule',
        of({ name: 'Jhon', surname: 'Doe' }, { name: 'Jhon', surname: 'Frank' })
      )
      .pipe(mergeMap(p => p))
      .subscribe(next => {
        expect(next.element.surname).toEqual('Doe')
        done()
      })
  })

  it('RuleRX throw an exception when using an operators not registered into the container', done => {
    let ruleRxContainer = RuleRxContainerFactory()

    ruleRxContainer.addRuleConfiguration({
      name: 'ExampleRule',
      rules: {
        all: [
          {
            fact: 'name is equal to jhon',
            operator: 'NotExistingOperator',
            path: '$.name',
            value: 'Jhon'
          },
          {
            fact: 'surname is equal to Doe',
            operator: 'equal',
            path: '$.surname',
            value: 'Doe'
          }
        ]
      }
    })

    new RuleRx<{ name: string; surname: string }>(ruleRxContainer)
      .evaluate(
        'ExampleRule',
        of({ name: 'Jhon', surname: 'Doe' }, { name: 'Jhon', surname: 'Frank' })
      )
      .pipe(mergeMap(p => p))
      .subscribe(
        next => {},
        error => {
          expect(error).toBeDefined()
          expect(error.message).toEqual(`operator NotExistingOperator is not registered`)
          done()
        }
      )
  })

  it('RuleRX throw an exception when using a rule not registered into the container', done => {
    let ruleRxContainer = RuleRxContainerFactory()

    ruleRxContainer.addRuleConfiguration({
      name: 'ExampleRule',
      rules: {
        all: [
          {
            fact: 'name is equal to jhon',
            operator: 'NotExistingOperator',
            path: '$.name',
            value: 'Jhon'
          },
          {
            fact: 'surname is equal to Doe',
            operator: 'equal',
            path: '$.surname',
            value: 'Doe'
          }
        ]
      }
    })

    new RuleRx<{ name: string; surname: string }>(ruleRxContainer)
      .evaluate(
        'NotExistingRule',
        of({ name: 'Jhon', surname: 'Doe' }, { name: 'Jhon', surname: 'Frank' })
      )
      .pipe(mergeMap(p => p))
      .subscribe(
        next => {},
        error => {
          expect(error).toBeDefined()
          expect(error.message).toEqual(`rule NotExistingRule is not registered`)
          done()
        }
      )
  })

  it('RuleRX can use operators registered into the container', done => {
    let ruleRxContainer = RuleRxContainerFactory()

    ruleRxContainer.addOperator('customOperator', (object, value) => {
      return true
    })

    ruleRxContainer.addRuleConfiguration({
      name: 'ExampleRule',
      rules: {
        all: [
          {
            fact: 'name is equal to jhon',
            operator: 'customOperator',
            path: '$.name',
            value: 'Hoooray!'
          }
        ]
      }
    })

    new RuleRx<{ name: string; surname: string }>(ruleRxContainer)
      .evaluate(
        'ExampleRule',
        of({ name: 'Jhon', surname: 'Doe' }, { name: 'Jhon', surname: 'Frank' })
      )
      .pipe(mergeMap(p => p))
      .subscribe(next => {
        expect(next.rules.every(p => p.value)).toEqual(true)
        done()
      })
  })
})
