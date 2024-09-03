import { shareReplay } from 'rxjs'
import type { ContextObserverFn } from '../types'
import {
  seriesDataMapObservable,
  groupDataMapObservable } from '../utils/observables'
import { highlightObservable, textSizePxObservable } from '../utils/observables'

export const createSeriesContextObserver: ContextObserverFn<'series'> = ({ subject, observer }) => {

  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
    shareReplay(1)
  )

  const seriesHighlight$ = highlightObservable({
    datumList$: observer.computedData$,
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  const SeriesDataMap$ = seriesDataMapObservable({
    datumList$: observer.computedData$
  }).pipe(
    shareReplay(1)
  )

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    textSizePx$,
    seriesHighlight$,
    SeriesDataMap$
  }
}
