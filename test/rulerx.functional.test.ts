import {RuleRx} from '../src/rule/rule-rx'
import {sumGreaterThan} from '../src/rule/operators'
import {BehaviorSubject} from 'rxjs'
import {finalize, mergeAll, tap} from 'rxjs/operators'

interface Basket {
  products: Product[]
  customer: {name:string}
  discount?: number;
}
interface Product {
  name: string;
  price: number;
}

describe('RuleRX functional uses cases', () => {

  it('RuleRX can be used to trigger a discount whenever the user carts reach a certain amount', done => {

    let customerCart1 = new BehaviorSubject<Basket>({
      products: [{
        name: "Art1",
        price: 10
      }],
      customer: {name: "Jhon"}
    });

    let customerCart2 = new BehaviorSubject<Basket>(  {
      products: [{
        name: "Art3",
        price: 50
      }],
      customer: {name: "Ada"}
    });

    let carts= [customerCart1,customerCart2];

    new RuleRx<Basket>()
      .evaluate(
        {
          all: [
            {
              fact: 'user cart sum is beyond 100',
              operator: sumGreaterThan,
              path: '$.products..price',
              value: 100
            }
          ]
        },
      ...carts
      )
      .pipe(
        mergeAll(),
        tap(p => p.element.discount = 10),
        finalize(() => {
          done();
        })
      )
      .subscribe(next => {
        expect(next.element.customer.name).toEqual("Jhon");
        expect(next.element.discount).toEqual(10);
      });

    customerCart1.next(
      {
        products: [{
         name: "Art1",
         price: 10
        },
          {
            name: "Art2",
            price: 100
          }],
        customer: {name: "Jhon"}
      }
    );


    customerCart2.next(
      {
        products: [{
          name: "Art3",
          price: 50
        },
          {
            name: "Art4",
            price: 50
          }],
        customer: {name: "Ada"}
      }
    );

    customerCart1.complete();
    customerCart2.complete();


  })
})
