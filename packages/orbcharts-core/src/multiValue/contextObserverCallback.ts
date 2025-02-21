import { map, shareReplay, distinctUntilChanged } from 'rxjs'
import type { Observable } from 'rxjs'
import type { ContextObserverCallback, ContextObserverTypeMap } from '../../lib/core-types'
import {
  highlightObservable,
  categoryDataMapObservable,
  textSizePxObservable,
  containerSizeObservable
} from '../utils/observables'
import {
  computedXYDataObservable,
  // multiValueAxesTransformObservable,
  // multiValueAxesReverseTransformObservable,
  graphicTransformObservable,
  graphicReverseScaleObservable,
  categoryLabelsObservable,
  visibleComputedDataObservable,
  visibleComputedSumDataObservable,
  visibleComputedRankingByIndexDataObservable,
  visibleComputedRankingBySumDataObservable,
  visibleComputedXYDataObservable,
  containerPositionObservable,
  // containerSizeObservable,
  xyMinMaxObservable,
  filteredXYMinMaxDataObservable,
  // visibleComputedRankingDataObservable,
  // rankingAmountLimitObservable,
  // rankingScaleObservable
  xScaleObservable,
  xSumScaleObservable,
  yScaleObservable
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
  
  const containerPosition$ = containerPositionObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$,
  }).pipe(
    shareReplay(1)
  )

  const containerSize$ = containerSizeObservable({
    layout$: observer.layout$,
    containerPosition$
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

  const highlight$ = highlightObservable({
    datumList$,
    fullChartParams$: observer.fullChartParams$,
    event$: subject.event$
  }).pipe(
    shareReplay(1)
  )

  const categoryLabels$ = categoryLabelsObservable({
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

  const visibleComputedData$ = visibleComputedDataObservable({
    computedData$: observer.computedData$,
  }).pipe(
    shareReplay(1)
  )

  const visibleComputedSumData$ = visibleComputedSumDataObservable({
    visibleComputedData$
  }).pipe(
    shareReplay(1)
  )

  // const valueIndex$ = observer.fullDataFormatter$.pipe(
  //   map(d => d.yAxis.valueIndex),
  //   distinctUntilChanged()
  // )

  const visibleComputedRankingByIndexData$ = visibleComputedRankingByIndexDataObservable({
    xyValueIndex$, // * 依據 valueIndex 來取得 visibleComputedData
    isCategorySeprate$,
    visibleComputedData$
  }).pipe(
    shareReplay(1)
  )

  const visibleComputedRankingBySumData$ = visibleComputedRankingBySumDataObservable({
    isCategorySeprate$,
    visibleComputedSumData$
  }).pipe(
    shareReplay(1)
  )

  const computedXYData$ = computedXYDataObservable({
    computedData$: observer.computedData$,
    xyMinMax$,
    xyValueIndex$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$,
  }).pipe(
    shareReplay(1)
  )

  const visibleComputedXYData$ = visibleComputedXYDataObservable({
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
  
  const graphicTransform$ = graphicTransformObservable({
    xyMinMax$,
    xyValueIndex$,
    filteredXYMinMaxData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$
  }).pipe(
    shareReplay(1)
  )

  const graphicReverseScale$ = graphicReverseScaleObservable({
    containerPosition$: containerPosition$,
    // multiValueAxesTransform$: multiValueAxesTransform$,
    graphicTransform$: graphicTransform$,
  }).pipe(
    shareReplay(1)
  )

  const xScale$ = xScaleObservable({
    visibleComputedSumData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    filteredXYMinMaxData$,
    containerSize$: containerSize$,
  }).pipe(
    shareReplay(1)
  )

  const xSumScale$ = xSumScaleObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    filteredXYMinMaxData$,
    containerSize$: containerSize$,
  }).pipe(
    shareReplay(1)
  )

  const yScale$ = yScaleObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    filteredXYMinMaxData$,
    containerSize$: containerSize$,
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
    containerPosition$,
    containerSize$,
    // multiValueAxesSize$,
    highlight$,
    categoryLabels$,
    CategoryDataMap$,
    xyMinMax$,
    xyValueIndex$,
    // computedXYData$,
    visibleComputedData$,
    visibleComputedSumData$,
    visibleComputedRankingByIndexData$,
    visibleComputedRankingBySumData$,
    visibleComputedXYData$,
    filteredXYMinMaxData$,
    // visibleComputedRankingData$,
    // rankingScale$,
    // multiValueAxesTransform$,
    // multiValueAxesReverseTransform$,
    graphicTransform$,
    graphicReverseScale$,
    xScale$,
    xSumScale$,
    yScale$
  }
}
