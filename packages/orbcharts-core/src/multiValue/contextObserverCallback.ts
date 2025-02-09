import { map, shareReplay, distinctUntilChanged } from 'rxjs'
import type { Observable } from 'rxjs'
import type { ContextObserverCallback, ContextObserverTypeMap } from '../../lib/core-types'
import {
  highlightObservable,
  categoryDataMapObservable,
  textSizePxObservable
} from '../utils/observables'
import {
  multiValueComputedXYDataObservable,
  // multiValueAxesTransformObservable,
  // multiValueAxesReverseTransformObservable,
  multiValueGraphicTransformObservable,
  multiValueGraphicReverseScaleObservable,
  multiValueCategoryLabelsObservable,
  multiValueVisibleComputedDataObservable,
  multiValueVisibleComputedXYDataObservable,
  multiValueContainerPositionObservable,
  multiValueContainerSizeObservable,
  xyMinMaxObservable,
  filteredXYMinMaxDataObservable,
  // visibleComputedRankingDataObservable,
  // rankingAmountLimitObservable,
  // rankingScaleObservable
} from '../utils/multiValueObservables'

export const contextObserverCallback: ContextObserverCallback<'multiValue'> = ({ subject, observer }) => {

  const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
    shareReplay(1)
  )

  const isCategorySeprate$ = observer.fullDataFormatter$.pipe(
    map(d => d.separateCategory),
    distinctUntilChanged(),
    shareReplay(1)
  )
  
  const multiValueContainerPosition$ = multiValueContainerPositionObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$,
  }).pipe(
    shareReplay(1)
  )

  const multiValueContainerSize$ = multiValueContainerSizeObservable({
    layout$: observer.layout$,
    multiValueContainerPosition$
  }).pipe(
    shareReplay(1)
  )

  // const multiValueAxesSize$ = multiValueAxesSizeObservable({
  //   fullDataFormatter$: observer.fullDataFormatter$,
  //   layout$: observer.layout$
  // }).pipe(
  //   shareReplay(1)
  // )

  // [xValueIndex, yValueIndex]
  const xyValueIndex$: Observable<[number, number]> = observer.fullDataFormatter$.pipe(
    map(d => [d.xAxis.valueIndex, d.yAxis.valueIndex] as [number, number]),
    distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1]),
    shareReplay(1)
  )

  const datumList$ = observer.computedData$.pipe(
    map(d => d.flat().flat())
  ).pipe(
    shareReplay(1)
  )

  const multiValueHighlight$ = highlightObservable({
    datumList$,
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  const categoryLabels$ = multiValueCategoryLabelsObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
  }).pipe(
    shareReplay(1)
  )

  const CategoryDataMap$ = categoryDataMapObservable({
    datumList$: datumList$
  }).pipe(
    shareReplay(1)
  )

  const xyMinMax$ = xyMinMaxObservable({
    computedData$: observer.computedData$,
    xyValueIndex$
  }).pipe(
    shareReplay(1)
  )


  const computedXYData$ = multiValueComputedXYDataObservable({
    computedData$: observer.computedData$,
    xyMinMax$,
    xyValueIndex$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$,
  }).pipe(
    shareReplay(1)
  )

  const visibleComputedData$ = multiValueVisibleComputedDataObservable({
    computedData$: observer.computedData$,
  }).pipe(
    shareReplay(1)
  )

  const visibleComputedXYData$ = multiValueVisibleComputedXYDataObservable({
    computedXYData$: computedXYData$,
  }).pipe(
    shareReplay(1)
  )

  const filteredXYMinMaxData$ = filteredXYMinMaxDataObservable({
    visibleComputedXYData$: visibleComputedXYData$,
    xyMinMax$,
    xyValueIndex$,
    fullDataFormatter$: observer.fullDataFormatter$,
  }).pipe(
    shareReplay(1)
  )

  // const visibleComputedRankingData$ = visibleComputedRankingDataObservable({
  //   visibleComputedData$
  // }).pipe(
  //   shareReplay(1)
  // )

  // const rankingAmountLimit$ = rankingAmountLimitObservable({
  //   layout$: observer.layout$,
  //   textSizePx$
  // }).pipe(
  //   shareReplay(1)
  // )

  // const rankingScale$ = rankingScaleObservable({
  //   layout$: observer.layout$,
  //   visibleComputedRankingData$,
  //   rankingAmountLimit$
  // }).pipe(
  //   shareReplay(1)
  // )

  // const multiValueAxesTransform$ = multiValueAxesTransformObservable({
  //   fullDataFormatter$: observer.fullDataFormatter$,
  //   layout$: observer.layout$
  // }).pipe(
  //   shareReplay(1)
  // )

  // const multiValueAxesReverseTransform$ = multiValueAxesReverseTransformObservable({
  //   multiValueAxesTransform$
  // }).pipe(
  //   shareReplay(1)
  // )
  
  const multiValueGraphicTransform$ = multiValueGraphicTransformObservable({
    xyMinMax$,
    xyValueIndex$,
    filteredXYMinMaxData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$
  }).pipe(
    shareReplay(1)
  )

  const multiValueGraphicReverseScale$ = multiValueGraphicReverseScaleObservable({
    multiValueContainerPosition$: multiValueContainerPosition$,
    // multiValueAxesTransform$: multiValueAxesTransform$,
    multiValueGraphicTransform$: multiValueGraphicTransform$,
  }).pipe(
    shareReplay(1)
  )


  return <ContextObserverTypeMap<'multiValue', any>>{
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    textSizePx$,
    isCategorySeprate$,
    multiValueContainerPosition$,
    multiValueContainerSize$,
    // multiValueAxesSize$,
    multiValueHighlight$,
    categoryLabels$,
    CategoryDataMap$,
    xyMinMax$,
    xyValueIndex$,
    computedXYData$,
    visibleComputedData$,
    visibleComputedXYData$,
    filteredXYMinMaxData$,
    // visibleComputedRankingData$,
    // rankingScale$,
    // multiValueAxesTransform$,
    // multiValueAxesReverseTransform$,
    multiValueGraphicTransform$,
    multiValueGraphicReverseScale$,
  }
}
