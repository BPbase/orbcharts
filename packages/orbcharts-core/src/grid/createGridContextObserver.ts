import { map, shareReplay } from 'rxjs'
import type { ContextObserverFn } from '../types'
import {
  highlightObservable,
  seriesDataMapObservable,
  groupDataMapObservable } from '../utils/observables'
import {
  gridAxesTransformObservable,
  gridAxesReverseTransformObservable,
  gridGraphicTransformObservable,
  gridGraphicReverseScaleObservable,
  gridAxesSizeObservable,
  existedSeriesLabelsObservable,
  gridVisibleComputedDataObservable,
  isSeriesPositionSeprateObservable,
  gridContainerObservable } from './gridObservables'

export const createGridContextObserver: ContextObserverFn<'grid'> = ({ subject, observer }) => {
  
  const isSeriesPositionSeprate$ = isSeriesPositionSeprateObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$
  }).pipe(
    shareReplay(1)
  )
  
  const gridContainer$ = gridContainerObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
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

  const existedSeriesLabels$ = existedSeriesLabelsObservable({
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

  const visibleComputedData$ = gridVisibleComputedDataObservable({
    computedData$: observer.computedData$,
  }).pipe(
    shareReplay(1)
  )


  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    isSeriesPositionSeprate$,
    gridContainer$,
    gridAxesTransform$,
    gridAxesReverseTransform$,
    gridGraphicTransform$,
    gridGraphicReverseScale$,
    gridAxesSize$,
    gridHighlight$,
    existedSeriesLabels$,
    SeriesDataMap$,
    GroupDataMap$,
    visibleComputedData$,
  }
}