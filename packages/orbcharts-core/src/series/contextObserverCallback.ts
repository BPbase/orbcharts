import { map, shareReplay } from 'rxjs'
import type { ContextObserverCallback } from '../../lib/core-types'
import {
  seriesDataMapObservable,
  groupDataMapObservable } from '../utils/observables'
import { highlightObservable, textSizePxObservable } from '../utils/observables'

import {
  datumLabelsObservable,
  separateSeriesObservable,
  separateLabelObservable,
  sumSeriesObservable,
  seriesVisibleComputedDataObservable,
  seriesComputedSortedDataObservable,
  seriesLabelsObservable,
  seriesContainerPositionObservable,
  datumContainerPositionMapObservable
} from './seriesObservables'

export const contextObserverCallback: ContextObserverCallback<'series'> = ({ subject, observer }) => {

  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
    shareReplay(1)
  )

  const datumLabels$ = datumLabelsObservable({
    computedData$: observer.computedData$
  }).pipe(
    shareReplay(1)
  )

  const separateSeries$ = separateSeriesObservable({
    fullDataFormatter$: observer.fullDataFormatter$
  }).pipe(
    shareReplay(1)
  )

  const separateLabel$ = separateLabelObservable({
    fullDataFormatter$: observer.fullDataFormatter$
  }).pipe(
    shareReplay(1)
  )

  const sumSeries$ = sumSeriesObservable({
    fullDataFormatter$: observer.fullDataFormatter$
  }).pipe(
    shareReplay(1)
  )

  // const visibleComputedData$ = seriesVisibleComputedDataObservable({
  //   computedData$: observer.computedData$,
  // }).pipe(
  //   shareReplay(1)
  // )

  const computedSortedData$ = seriesComputedSortedDataObservable({
    computedData$: observer.computedData$,
    separateSeries$: separateSeries$,
    separateLabel$: separateLabel$,
    sumSeries$: sumSeries$,
    datumLabels$: datumLabels$,
  }).pipe(
    shareReplay(1)
  )

  const visibleComputedSortedData$ = seriesVisibleComputedDataObservable({
    computedData$: computedSortedData$,
  }).pipe(
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
  }).pipe(
    shareReplay(1)
  )

  const SeriesDataMap$ = seriesDataMapObservable({
    datumList$
  }).pipe(
    shareReplay(1)
  )

  const seriesContainerPosition$ = seriesContainerPositionObservable({
    computedSortedData$: computedSortedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$,
  }).pipe(
    shareReplay(1)
  )

  const DatumContainerPositionMap$ = datumContainerPositionMapObservable({
    seriesContainerPosition$: seriesContainerPosition$,
    computedSortedData$: computedSortedData$,
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
    // visibleComputedData$,
    visibleComputedSortedData$,
    separateSeries$,
    separateLabel$,
    sumSeries$,
    computedSortedData$,
    seriesHighlight$,
    seriesLabels$,
    SeriesDataMap$,
    seriesContainerPosition$,
    DatumContainerPositionMap$,
  }
}
