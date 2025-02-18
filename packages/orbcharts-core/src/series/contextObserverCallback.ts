import { map, shareReplay } from 'rxjs'
import type { ContextObserverCallback } from '../../lib/core-types'
import {
  seriesDataMapObservable,
  groupDataMapObservable } from '../utils/observables'
import { highlightObservable, textSizePxObservable } from '../utils/observables'

import {
  separateSeriesObservable,
  seriesVisibleComputedDataObservable,
  seriesComputedLayoutDataObservable,
  seriesLabelsObservable,
  seriesContainerPositionObservable,
  seriesContainerPositionMapObservable
} from '../utils/seriesObservables'

export const contextObserverCallback: ContextObserverCallback<'series'> = ({ subject, observer }) => {

  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
    shareReplay(1)
  )

  const separateSeries$ = separateSeriesObservable({
    fullDataFormatter$: observer.fullDataFormatter$
  })

  const visibleComputedData$ = seriesVisibleComputedDataObservable({
    computedData$: observer.computedData$,
  })

  const computedLayoutData$ = seriesComputedLayoutDataObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$
  }).pipe(
    shareReplay(1)
  )

  const visibleComputedLayoutData$ = seriesVisibleComputedDataObservable({
    computedData$: computedLayoutData$,
  })

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

  const SeriesContainerPositionMap$ = seriesContainerPositionMapObservable({
    seriesContainerPosition$: seriesContainerPosition$,
    seriesLabels$: seriesLabels$,
    separateSeries$: separateSeries$,
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
    visibleComputedData$,
    visibleComputedLayoutData$,
    separateSeries$,
    computedLayoutData$,
    seriesHighlight$,
    seriesLabels$,
    SeriesDataMap$,
    seriesContainerPosition$,
    SeriesContainerPositionMap$,
  }
}
