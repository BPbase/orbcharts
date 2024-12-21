import { map, shareReplay, distinctUntilChanged } from 'rxjs'
import type { ContextObserverCallback } from '../../lib/core-types'
import {
  highlightObservable,
  seriesDataMapObservable,
  groupDataMapObservable,
  textSizePxObservable } from '../utils/observables'
import {
  gridComputedLayoutDataObservable,
  gridAxesSizeObservable,
  gridSeriesLabelsObservable,
  gridVisibleComputedDataObservable,
  gridVisibleComputedLayoutDataObservable,
  // isSeriesSeprateObservable,
  gridContainerPositionObservable,
  computedStackedDataObservables,
  groupScaleDomainValueObservable,
  filteredMinMaxValueObservable,
  gridAxesTransformObservable,
  gridAxesReverseTransformObservable,
  gridGraphicTransformObservable,
  gridGraphicReverseScaleObservable,
} from '../utils/gridObservables'

export const contextObserverCallback: ContextObserverCallback<'grid'> = ({ subject, observer }) => {
  
  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
    shareReplay(1)
  )

  const isSeriesSeprate$ = observer.fullDataFormatter$.pipe(
    map(d => d.separateSeries),
    distinctUntilChanged(),
    shareReplay(1)
  )
  
  const gridContainerPosition$ = gridContainerPositionObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$,
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

  const seriesLabels$ = gridSeriesLabelsObservable({
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

  const computedStackedData$ = computedStackedDataObservables({
    computedData$: observer.computedData$,
    isSeriesSeprate$: isSeriesSeprate$
  }).pipe(
    shareReplay(1)
  )

  const groupScaleDomainValue$ = groupScaleDomainValueObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
  }).pipe(
    shareReplay(1)
  )

  const filteredMinMaxValue$ = filteredMinMaxValueObservable({
    computedData$: observer.computedData$,
    groupScaleDomainValue$: groupScaleDomainValue$,
  }).pipe(
    shareReplay(1)
  )

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
    groupScaleDomainValue$: groupScaleDomainValue$,
    filteredMinMaxValue$: filteredMinMaxValue$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$
  }).pipe(
    shareReplay(1)
  )

  const gridGraphicReverseScale$ = gridGraphicReverseScaleObservable({
    gridContainerPosition$: gridContainerPosition$,
    gridAxesTransform$: gridAxesTransform$,
    gridGraphicTransform$: gridGraphicTransform$,
  })


  return {
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    textSizePx$,
    isSeriesSeprate$,
    gridContainerPosition$,
    gridAxesSize$,
    gridHighlight$,
    seriesLabels$,
    SeriesDataMap$,
    GroupDataMap$,
    computedLayoutData$,
    visibleComputedData$,
    visibleComputedLayoutData$,
    computedStackedData$,
    groupScaleDomainValue$,
    filteredMinMaxValue$,
    gridAxesTransform$,
    gridAxesReverseTransform$,
    gridGraphicTransform$,
    gridGraphicReverseScale$,
  }
}
