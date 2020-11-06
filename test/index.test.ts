import { RuleRxContainer, Operator, RuleConfiguration, RuleRx, equal } from '../src/rulerx'
import { of } from 'rxjs'

describe('index file', () => {
  it('Exports the library', () => {
    const container = new RuleRxContainer(
      new Map<string, Operator<any>>(),
      new Map<string, RuleConfiguration<any>>()
    )
    new RuleRx(container).evaluate([], of([]))
    expect(equal).toBeDefined()
    expect(container).toBeDefined()
  })
})
