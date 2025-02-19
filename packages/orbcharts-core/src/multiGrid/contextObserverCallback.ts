import {
  map,
  shareReplay } from 'rxjs'
import type { ContextObserverCallback } from '../../lib/core-types'
import { multiGridEachDetailObservable, multiGridContainerObservable } from '../utils/multiGridObservables'
import { textSizePxObservable, containerSizeObservable } from '../utils/observables'

export const contextObserverCallback: ContextObserverCallback<'multiGrid'> = ({ subject, observer }) => {

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
  }).pipe(
    shareReplay(1)
  )

  const containerSize$ = containerSizeObservable({
    layout$: observer.layout$,
    containerPosition$: multiGridContainerPosition$.pipe(
      map(d => d.flat())
    )
  }).pipe(
    shareReplay(1)
  )
  // multiGridContainerPosition$.subscribe(d => {
  //   console.log('multiGridContainerPosition$', d)
  // })

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    containerSize$,
    textSizePx$,
    multiGridContainerPosition$,
    multiGridEachDetail$,
    // multiGridContainer$
  }
}
