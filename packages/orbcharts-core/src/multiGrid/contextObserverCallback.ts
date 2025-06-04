import {
  map,
  switchMap,
  merge,
  forkJoin,
  shareReplay,
  Observable } from 'rxjs'
import type { ContextObserverCallback, DataGridDatum } from '../../lib/core-types'
import { multiGridEachDetailObservable, multiGridContainerObservable } from './multiGridObservables'
import { textSizePxObservable, containerSizeObservable, highlightObservable } from '../utils/observables'
// import { createMultiGridSeriesLabels } from '../utils/orbchartsUtils'
import { filteredMinMaxValueObservable } from '../grid/gridObservables'

export const contextObserverCallback: ContextObserverCallback<'multiGrid'> = ({ subject, observer }) => {

  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
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
    ),
    container$: observer.fullDataFormatter$.pipe(
      map(d => d.container)
    )
  }).pipe(
    shareReplay(1)
  )

  // highlight全部grid
  const multiGridHighlight$ = highlightObservable({
    datumList$: observer.computedData$.pipe(
      map(d => d.flat().flat()),
      shareReplay(1)
    ),
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  const multiGridEachDetail$ = multiGridEachDetailObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$,
    containerSize$
  }).pipe(
    shareReplay(1)
  )
  // multiGridContainerPosition$.subscribe(d => {
  //   console.log('multiGridContainerPosition$', d)
  // })

  const filteredMinMaxValue$: Observable<[number, number]> = multiGridEachDetail$.pipe(
    switchMap(details => {
      return forkJoin(details.map((detail, index) => {
        return detail.filteredMinMaxValue$
      }))
    }),
    map(filteredMinMaxValue => {
      return [
        Math.min(...filteredMinMaxValue.map(d => d[0])),
        Math.max(...filteredMinMaxValue.map(d => d[1]))
      ]
    })
  )

  const filteredStackedMinMaxValue$: Observable<[number, number]> = multiGridEachDetail$.pipe(
    switchMap(details => {
      return forkJoin(details.map((detail, index) => {
        return detail.filteredStackedMinMaxValue$
      }))
    }),
    map(filteredMinMaxValue => {
      return [
        Math.min(...filteredMinMaxValue.map(d => d[0])),
        Math.max(...filteredMinMaxValue.map(d => d[1]))
      ]
    })
  )

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    textSizePx$,
    containerSize$,
    multiGridHighlight$,
    multiGridContainerPosition$,
    filteredMinMaxValue$,
    filteredStackedMinMaxValue$,
    multiGridEachDetail$,
    // multiGridContainer$
  }
}
