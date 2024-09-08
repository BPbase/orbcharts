import { map, shareReplay } from 'rxjs'
import type { ContextObserverFn } from '../types'
import {
  seriesDataMapObservable,
  groupDataMapObservable } from '../utils/observables'
import { highlightObservable, textSizePxObservable } from '../utils/observables'
import { seriesLabelsObservable, seriesContainerPositionObservable } from './seriesObservables'

export const createSeriesContextObserver: ContextObserverFn<'series'> = ({ subject, observer }) => {

  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
    shareReplay(1)
  )

  const datumList$ = observer.computedData$.pipe(
    map(d => d.flat())
  ).pipe(
    shareReplay(1)
  )

  const seriesHighlight$ = highlightObservable({
    datumList$,
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  const seriesLabels$ = seriesLabelsObservable({
    computedData$: observer.computedData$,
  })


  const SeriesDataMap$ = seriesDataMapObservable({
    datumList$
  }).pipe(
    shareReplay(1)
  )

  const seriesContainerPosition$ = seriesContainerPositionObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$,
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
    seriesLabels$,
    SeriesDataMap$,
    seriesContainerPosition$
  }
}
