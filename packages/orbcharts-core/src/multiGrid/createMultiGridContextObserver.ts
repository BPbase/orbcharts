import {
  shareReplay } from 'rxjs'
import type { ContextObserverFn } from '../types'
import { multiGridObservable } from './multiGridObservables'

export const createMultiGridContextObserver: ContextObserverFn<'multiGrid'> = ({ subject, observer }) => {

  const multiGrid$ = multiGridObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    multiGrid$
  }
}
