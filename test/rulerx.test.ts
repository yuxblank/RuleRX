import {RuleRx} from "../src/rule/rule-rx";
import {equal, greaterThan} from "../src/rule/operators";
import {BehaviorSubject, of} from "rxjs";
import {filter, finalize, flatMap, map, mergeMap, tap} from "rxjs/operators";

describe("RuleRX", () => {
  it("RuleRX can evaluate a rule", () => {


    new RuleRx<{name: string, surname:string}>().evaluate([
      {
        fact: "name is equal to jhon",
        operator: equal,
        path: "$.name",
        value: "Jhon"
      }
    ],
      of(
        {name: "Jhon", surname: "Doe"},
             {name: "Jhon", surname: "Frank"}
      )
    ).subscribe(
      next => {
        expect(next.every(result => result.value)).toBe(true)
      }
    )
  })
  it("RuleRX can evaluate a rule and filter the fact when a condition is met", () => {

    new RuleRx<{price: number, product:string}>().evaluate([
        {
          fact: "price is greater than 10",
          operator: greaterThan,
          path: "$.price",
          value: "Jhon"
        }
      ],
      of(
        {price: 5,product: "productWithPrice5"}
      ),
      of({
        price : 10, product: "productWithPrice10"
      })
    ).
      pipe(
        map(f => f.filter( x => x.fact === "price is greater than 10"))
    ).subscribe(
      next => {
        expect(next.every(el => el.element.product == "productWithPrice10" || el.element.price === 10))
      }
    )
  })


  it("RuleRX can evaluate observable that emit new values over time", () => {

    let count = 0;

    let behaviorSubject1 = new BehaviorSubject<{price: number, product:string}>({
      price: 0,
      product: "prod_1"
    });
    let behaviorSubject2 = new BehaviorSubject<{price: number, product:string}>({
      price: 0,
      product: "prod_2"
    });

    new RuleRx<{price: number, product:string}>().evaluate([
        {
          fact: "price is greater than 10",
          operator: greaterThan,
          path: "$.price",
          value: "10"
        }
      ],
      behaviorSubject1,
      behaviorSubject2
    ).
    pipe(
      mergeMap(f => f.filter( x => x.fact === "price is greater than 10")),
      filter(f => f.value),
      tap(x => count++),
      finalize(() => expect(count).toEqual(2))
    ).subscribe(
      next => {
        console.log(next);
      }
    )

    behaviorSubject1.next({
      product: "prod_1",
      price: 11
    });
    behaviorSubject2.next({
      product: "prod_2",
      price: 5
    });
    behaviorSubject2.next({
      product: "prod_2",
      price: 100
    });

    behaviorSubject1.complete();
    behaviorSubject2.complete();

  })
})
