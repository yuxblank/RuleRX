import {RuleRx} from "../src/rule/rule-rx";
import {equal} from "../src/rule/operators";
import {of} from "rxjs";
import {filter} from "rxjs/operators";

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
})
