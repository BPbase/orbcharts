import type { ContextObserverFn } from '../types'

export const createRelationshipContextObserver: ContextObserverFn<'relationship'> = ({ subject, observer }) => {

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
  }
}
