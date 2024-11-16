import type { ContextObserverFn } from '../../lib/core-types'

export const createMultiValueContextObserver: ContextObserverFn<'multiValue'> = ({ subject, observer }) => {

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
  }
}
