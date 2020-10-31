import { RuleRx } from '../src/rule/rule-rx'
import { anyOf, equal, greaterOrEqThan, greaterThan, lessOrEqThan } from '../src/rule/operators'
import { BehaviorSubject, of } from 'rxjs'
import { concatMap, filter, finalize, flatMap, map, mergeMap, tap } from 'rxjs/operators'

describe('RuleRX', () => {
  it('RuleRX can evaluate multiple rules on an observable array of the object', done => {
    new RuleRx<{ name: string; surname: string }>()
      .evaluate(
        {
          all: [
            {
              fact: 'name is equal to jhon',
              operator: equal,
              path: '$.name',
              value: 'Jhon'
            },
            {
              fact: 'surname is equal to Doe',
              operator: equal,
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
  it('RuleRX can evaluate a rule and output the element and the fact only when the conditions are met', done => {
    new RuleRx<{ price: number; product: string }>()
      .evaluate(
        {
          all: [
            {
              fact: 'price is greater than 10',
              operator: greaterThan,
              path: '$.price',
              value: 10
            }
          ]
        },
        of({ price: 5, product: 'productWithPrice5' }),
        of({
          price: 10,
          product: 'productWithPrice10'
        }),
        of({
          price: 100,
          product: 'productWithPrice100'
        }),
        of({
          price: 149,
          product: 'productWithPrice149'
        })
      )
      .pipe()
      .subscribe(next => {
        expect(next.length).toEqual(2)
        done()
      })
  })

  it('RuleRX can evaluate a rule and output the element and the fact only when one of the conditions are met', done => {
    let count = 0
    new RuleRx<{ price: number; product: string }>()
      .evaluate(
        {
          any: [
            {
              fact: 'price is greater than 10',
              operator: greaterOrEqThan,
              path: '$.price',
              value: 10
            },
            {
              fact: 'price is less or equal than 0',
              operator: lessOrEqThan,
              path: '$.price',
              value: 0
            }
          ]
        },
        of({ price: 5, product: 'productWithPrice5' }),
        of({
          price: 10,
          product: 'productWithPrice10'
        }),
        of({
          price: 100,
          product: 'productWithPrice100'
        }),
        of({
          price: 149,
          product: 'productWithPrice149'
        })
      )
      .pipe(tap(x => count++))
      .subscribe(next => {
        expect(next.length).toEqual(3)
        done()
      })
  })

  it('RuleRX can evaluate a rule and output the element and the fact only when none of the conditions are met', done => {
    let count = 0
    new RuleRx<{ price: number; product: string }>()
      .evaluate(
        {
          none: [
            {
              fact: 'price is greater than 10',
              operator: greaterOrEqThan,
              path: '$.price',
              value: 10
            },
            {
              fact: 'price is less or equal than 0',
              operator: lessOrEqThan,
              path: '$.price',
              value: 0
            }
          ]
        },
        of({ price: 5, product: 'productWithPrice5' }),
        of({
          price: 10,
          product: 'productWithPrice10'
        }),
        of({
          price: 100,
          product: 'productWithPrice100'
        }),
        of({
          price: 149,
          product: 'productWithPrice149'
        })
      )
      .pipe(tap(x => count++))
      .subscribe(next => {
        expect(next.length).toEqual(1)
        expect(next[0].element.product).toEqual('productWithPrice5')
        done()
      })
  })

  it('RuleRX can evaluate multiple rules and return elements only when rules are met', done => {
    let count = 0
    new RuleRx<{ price: number; product: string; category: 'TECH' | 'FOOD' | 'TOY' }>()
      .evaluate(
        {
          all: [
            {
              fact: 'price is greater or equal than 10',
              operator: greaterOrEqThan,
              path: '$.price',
              value: '10'
            },
            {
              fact: 'category is TECH or TOY',
              operator: anyOf,
              path: '$.category',
              value: ['TOY', 'TV']
            }
          ]
        },
        of({
          category: 'FOOD',
          price: 8,
          product: 'Beer'
        }),
        of({
          price: 5.5,
          product: 'TV Ultra Cheap',
          category: 'TECH'
        }),
        of({
          category: 'FOOD',
          price: 44.2,
          product: 'Mortadella mmmmh Italy!'
        }),
        of({
          category: 'TOY',
          price: 0.1,
          product: 'Gamer Color BattleRX'
        }),
        of({
          category: 'TOY',
          price: 1000.05,
          product: 'Game PoWaRX++'
        })
      )
      .pipe(
        mergeMap(f => f),
        tap(x => count++)
      )
      .subscribe(next => {
        expect(count).toEqual(1)
        done()
      })
  })

  it('RuleRX can evaluate observable that emit new values over time', done => {
    let count = 0

    let behaviorSubject1 = new BehaviorSubject<{ price: number; product: string }>({
      price: 0,
      product: 'prod_1'
    })
    let behaviorSubject2 = new BehaviorSubject<{ price: number; product: string }>({
      price: 0,
      product: 'prod_2'
    })

    new RuleRx<{ price: number; product: string }>()
      .evaluate(
        {
          all: [
            {
              fact: 'price is greater than 10',
              operator: greaterThan,
              path: '$.price',
              value: '10'
            }
          ]
        },
        behaviorSubject1,
        behaviorSubject2
      )
      .pipe(
        mergeMap(p => p),
        tap(x => count++),
        finalize(() => done())
      )
      .subscribe(next => {
        expect(next.element.price).toBeGreaterThan(10)
      })

    behaviorSubject1.next({
      product: 'prod_1',
      price: 11
    })
    behaviorSubject2.next({
      product: 'prod_2',
      price: 5
    })
    behaviorSubject2.next({
      product: 'prod_2',
      price: 100
    })

    behaviorSubject1.complete()
    behaviorSubject2.complete()
  })

  it('RuleRX results can be piped using regular operators', done => {
    let count = 0
    new RuleRx<{ price: number; product: string; category: 'TECH' | 'FOOD' | 'TOY' }>()
      .evaluate(
        {
          all: [
            {
              fact: 'price is greater or equal than 10',
              operator: greaterOrEqThan,
              path: '$.price',
              value: '10'
            },
            {
              fact: 'category is TECH or TOY',
              operator: anyOf,
              path: '$.category',
              value: ['TOY', 'TV']
            }
          ]
        },
        of({
          category: 'TOY',
          price: 5,
          product: 'Gamer Color BattleRX'
        }),
        of({
          category: 'TOY',
          price: 10,
          product: 'Gamer Color BattleRX'
        }),
        of({
          category: 'TECH',
          price: 1000.05,
          product: 'SanZung HDTV'
        })
      )
      .pipe(
        concatMap(p => p),
        filter(p => p.element.category === 'TOY'),
        tap(x => count++)
      )
      .subscribe(next => {
        expect(count).toEqual(1)
        done()
      })
  })
})
