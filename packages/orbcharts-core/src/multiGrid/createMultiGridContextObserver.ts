import { map, shareReplay } from 'rxjs'
import type { ContextObserverFn } from '../types'
import {
  highlightObservable,
  seriesDataMapObservable,
  groupDataMapObservable } from '../utils/observables'
import {
  gridAxesTransformObservable,
  gridGraphicTransformObservable,
  gridAxesOppositeTransformObservable,
  gridAxesSizeObservable,
  gridVisibleComputedDataObservable } from '../grid/gridObservables'

export const createMultiGridContextObserver: ContextObserverFn<'multiGrid'> = ({ subject, observer }) => {

  // const multiGrid$ = 



  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
  }
}
