import {RuleRx} from "../src/rule/rule-rx";
import {equal, greaterThan} from "../src/rule/operators";
import {of} from "rxjs";
import {filter, flatMap, map, mergeMap} from "rxjs/operators";

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
})
