import { map, shareReplay } from 'rxjs'
import type { ContextObserverFn } from '../types'
import {
  highlightObservable,
  seriesDataMapObservable,
  groupDataMapObservable } from '../utils/observables'
import {
  gridAxesTransformObservable,
  gridGraphicTransformObservable,
  gridAxesOppositeTransformObservable,
  gridAxesSizeObservable,
  gridVisibleComputedDataObservable,
  gridContainerObservable } from './gridObservables'

export const createGridContextObserver: ContextObserverFn<'grid'> = ({ subject, observer }) => {
  
  const gridAxesTransform$ = gridAxesTransformObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$
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

  const gridAxesOppositeTransform$ = gridAxesOppositeTransformObservable({
    gridAxesTransform$
  }).pipe(
    shareReplay(1)
  )

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

  const gridContainer$ = gridContainerObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    layout$: observer.layout$,
  })

  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    gridAxesTransform$,
    gridGraphicTransform$,
    gridAxesOppositeTransform$,
    gridAxesSize$,
    gridHighlight$,
    SeriesDataMap$,
    GroupDataMap$,
    visibleComputedData$,
    gridContainer$
  }
}
