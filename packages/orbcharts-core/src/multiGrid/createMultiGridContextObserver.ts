import {
  map,
  shareReplay } from 'rxjs'
import type { ContextObserverFn } from '../../lib/core-types'
import { multiGridEachDetailObservable, multiGridContainerObservable } from './multiGridObservables'
import { textSizePxObservable } from '../utils/observables'

export const createMultiGridContextObserver: ContextObserverFn<'multiGrid'> = ({ subject, observer }) => {

  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
    shareReplay(1)
  )

  const multiGridEachDetail$ = multiGridEachDetailObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  const multiGridContainerPosition$ = multiGridContainerObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$,
  })

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    textSizePx$,
    multiGridContainerPosition$,
    multiGridEachDetail$,
    // multiGridContainer$
  }
}
