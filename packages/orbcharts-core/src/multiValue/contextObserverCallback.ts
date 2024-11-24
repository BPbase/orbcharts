import type { ContextObserverCallback } from '../../lib/core-types'

export const contextObserverCallback: ContextObserverCallback<'multiValue'> = ({ subject, observer }) => {

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
  }
}
