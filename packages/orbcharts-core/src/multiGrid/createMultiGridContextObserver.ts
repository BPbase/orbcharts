import type { ContextObserverFn } from '../types'

export const createMultiGridContextObserver: ContextObserverFn<'multiGrid'> = ({ subject, observer }) => {

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
  }
}
