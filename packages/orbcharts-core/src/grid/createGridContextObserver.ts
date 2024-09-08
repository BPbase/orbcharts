import { map, shareReplay } from 'rxjs'
import type { ContextObserverFn } from '../types'
import {
  highlightObservable,
  seriesDataMapObservable,
  groupDataMapObservable,
  textSizePxObservable } from '../utils/observables'
import {
  gridComputedLayoutDataObservable,
  gridAxesTransformObservable,
  gridAxesReverseTransformObservable,
  gridGraphicTransformObservable,
  gridGraphicReverseScaleObservable,
  gridAxesSizeObservable,
  existSeriesLabelsObservable,
  gridVisibleComputedDataObservable,
  gridVisibleComputedLayoutDataObservable,
  // isSeriesSeprateObservable,
  gridContainerObservable } from './gridObservables'

export const createGridContextObserver: ContextObserverFn<'grid'> = ({ subject, observer }) => {
  
  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
    shareReplay(1)
  )

  // const isSeriesSeprate$ = isSeriesSeprateObservable({
  //   computedData$: observer.computedData$,
  //   fullDataFormatter$: observer.fullDataFormatter$
  // }).pipe(
  //   shareReplay(1)
  // )
  
  const gridContainer$ = gridContainerObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$,
  })

  const gridAxesTransform$ = gridAxesTransformObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$
  }).pipe(
    shareReplay(1)
  )

  const gridAxesReverseTransform$ = gridAxesReverseTransformObservable({
    gridAxesTransform$
  }).pipe(
    shareReplay(1)
  )
  
  const gridGraphicTransform$ = gridGraphicTransformObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$
  }).pipe(
    shareReplay(1)
  )

  const gridGraphicReverseScale$ = gridGraphicReverseScaleObservable({
    gridContainer$: gridContainer$,
    gridAxesTransform$: gridAxesTransform$,
    gridGraphicTransform$: gridGraphicTransform$,
  })

  const gridAxesSize$ = gridAxesSizeObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$
  }).pipe(
    shareReplay(1)
  )

  const datumList$ = observer.computedData$.pipe(
    map(d => d.flat())
  ).pipe(
    shareReplay(1)
  )

  const gridHighlight$ = highlightObservable({
    datumList$,
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  const existSeriesLabels$ = existSeriesLabelsObservable({
    computedData$: observer.computedData$,
  })

  const SeriesDataMap$ = seriesDataMapObservable({
    datumList$: datumList$
  }).pipe(
    shareReplay(1)
  )

  const GroupDataMap$ = groupDataMapObservable({
    datumList$: datumList$
  }).pipe(
    shareReplay(1)
  )

  const computedLayoutData$ = gridComputedLayoutDataObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$,
  }).pipe(
    shareReplay(1)
  )

  const visibleComputedData$ = gridVisibleComputedDataObservable({
    computedData$: observer.computedData$,
  }).pipe(
    shareReplay(1)
  )

  const visibleComputedLayoutData$ = gridVisibleComputedLayoutDataObservable({
    computedLayoutData$: computedLayoutData$,
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
    // isSeriesSeprate$,
    gridContainer$,
    gridAxesTransform$,
    gridAxesReverseTransform$,
    gridGraphicTransform$,
    gridGraphicReverseScale$,
    gridAxesSize$,
    gridHighlight$,
    existSeriesLabels$,
    SeriesDataMap$,
    GroupDataMap$,
    computedLayoutData$,
    visibleComputedData$,
    visibleComputedLayoutData$,
  }
}
