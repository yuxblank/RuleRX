import {RuleRx} from "../src/rule/rule-rx";
import {
  allOf,
  allOfList,
  anyOf, anyOfList,
  equal,
  greaterOrEqThan,
  greaterThan,
  lessOrEqThan, lessThan, noneOf, noneOfList
} from "../src/rule/operators";
import {BehaviorSubject, of} from "rxjs";
import {concatMap, filter, finalize, flatMap, map, mergeMap, tap} from "rxjs/operators";

describe("RuleRX operators", () => {
  it("RuleRX allOfList operator should match all values of a an array", (done) => {
    new RuleRx<{ name: string, color: string[] }>().evaluate(
      {
        any:
          [{
            fact: "has blue and pink",
            operator: allOfList,
            path: "$.color",
            value: ["blue", "pink"]
          },
          ]
      }
      ,
      of(
        {name: "1", color: ["blue", "pink"]},
      ),
      of({name: "2", color: ['pink']})
    )
      .pipe(mergeMap(p => p))
      .subscribe(
        next => {
          expect(next.element.name).toEqual("1")
          done();
        }
      )
  })
  it("RuleRX noneOfList operator should match all values of a an array", (done) => {
    new RuleRx<{ name: string, color: string[] }>().evaluate(
      {
        any:
          [{
            fact: "has blue and pink",
            operator: noneOfList,
            path: "$.color",
            value: ["blue", "pink"]
          },
          ]
      }
      ,
      of(
        {name: "1", color: ["blue", "pink"]},
      ),
      of({name: "2", color: ['pink']}),
      of({name: "3", color: ['red']})
    )
      .pipe(mergeMap(p => p))
      .subscribe(
        next => {
          expect(next.element.name).toEqual("3")
          done();
        }
      )
  })
  it("RuleRX anyOfList operator should match all values of a an array", (done) => {
    new RuleRx<{ name: string, color: string[] }>().evaluate(
      {
        any:
          [{
            fact: "has blue and pink",
            operator: anyOfList,
            path: "$.color",
            value: ["blue", "pink"]
          },
          ]
      }
      ,
      of(
        {name: "1", color: ["blue", "pink"]}
      ),
      of(
        {name: "2", color: ['pink']},
      ),
      of({name: "3", color: ['red']})
    )
      .subscribe(
        next => {
          expect(next.find(f => f.element.name === "1")).toBeTruthy();
          expect(next.find(f => f.element.name === "2")).toBeTruthy();
          expect(next.find(f => f.element.name === "3")).toBeFalsy();
          done();
        }
      )
  })

  it("RuleRX lessThan operator should match all values that are less than an expected number", (done) => {
    new RuleRx<{ name: string, count: number }>().evaluate(
      {
        any:
          [{
            fact: "Count is less than 15",
            operator: lessThan,
            path: "$.count",
            value: 15
          },
          ]
      }
      ,
      of(
        {name: "1", count: 1}
      ),
      of(
        {name: "2", count: 10},
      ),
      of({name: "3",count: 25})
    )
      .subscribe(
        next => {
          expect(next.find(f => f.element.name === "1")).toBeTruthy();
          expect(next.find(f => f.element.name === "2")).toBeTruthy();
          expect(next.find(f => f.element.name === "3")).toBeFalsy();
          done();
        }
      )
  })
  it("RuleRX allOf operator should match all values that are set in the value list", (done) => {
    new RuleRx<{ name: string, color:string }>().evaluate(
      {
        any:
          [{
            fact: "Color is green or blue",
            operator: allOf,
            path: "$.color",
            value: ['blue','green']
          },
          ]
      }
      ,
      of(
        {name: "1", color: "blue"}
      ),
      of(
        {name: "2", color: "green"},
      ),
      of({name: "3",color: "red"})
    )
      .subscribe(
        next => {
          expect(next.find(f => f.element.name === "1")).toBeTruthy();
          expect(next.find(f => f.element.name === "2")).toBeTruthy();
          expect(next.find(f => f.element.name === "3")).toBeFalsy();
          done();
        }
      )
  })

  it("RuleRX noneOf operator should match all values that are not set in the value list", (done) => {
    new RuleRx<{ name: string, color:string }>().evaluate(
      {
        any:
          [{
            fact: "Color is NOT green or blue",
            operator: noneOf,
            path: "$.color",
            value: ['blue','green']
          },
          ]
      }
      ,
      of(
        {name: "1", color: "blue"}
      ),
      of(
        {name: "2", color: "green"},
      ),
      of({name: "3",color: "red"})
    )
      .subscribe(
        next => {
          expect(next.find(f => f.element.name === "1")).toBeFalsy();
          expect(next.find(f => f.element.name === "2")).toBeFalsy();
          expect(next.find(f => f.element.name === "3")).toBeTruthy();
          done();
        }
      )
  })



})
