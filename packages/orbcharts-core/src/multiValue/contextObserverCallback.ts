import { map, shareReplay, distinctUntilChanged } from 'rxjs'
import type { ContextObserverCallback, ContextObserverTypeMap } from '../../lib/core-types'
import {
  highlightObservable,
  categoryDataMapObservable,
  textSizePxObservable
} from '../utils/observables'
import {
  multiValueComputedLayoutDataObservable,
  // multiValueAxesTransformObservable,
  // multiValueAxesReverseTransformObservable,
  multiValueGraphicTransformObservable,
  multiValueGraphicReverseScaleObservable,
  multiValueCategoryLabelsObservable,
  multiValueVisibleComputedDataObservable,
  multiValueVisibleComputedLayoutDataObservable,
  multiValueContainerPositionObservable,
  minMaxXYObservable,
  filteredMinMaxXYDataObservable
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
  })

  // const multiValueAxesSize$ = multiValueAxesSizeObservable({
  //   fullDataFormatter$: observer.fullDataFormatter$,
  //   layout$: observer.layout$
  // }).pipe(
  //   shareReplay(1)
  // )

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
  })

  const CategoryDataMap$ = categoryDataMapObservable({
    datumList$: datumList$
  }).pipe(
    shareReplay(1)
  )

  const minMaxXY$ = minMaxXYObservable({
    computedData$: observer.computedData$
  }).pipe(
    shareReplay(1)
  )


  const computedLayoutData$ = multiValueComputedLayoutDataObservable({
    computedData$: observer.computedData$,
    minMaxXY$,
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

  const visibleComputedLayoutData$ = multiValueVisibleComputedLayoutDataObservable({
    computedLayoutData$: computedLayoutData$,
  }).pipe(
    shareReplay(1)
  )

  const filteredMinMaxXYData$ = filteredMinMaxXYDataObservable({
    visibleComputedLayoutData$: visibleComputedLayoutData$,
    minMaxXY$,
    fullDataFormatter$: observer.fullDataFormatter$,
  }).pipe(
    shareReplay(1)
  )

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
    minMaxXY$,
    filteredMinMaxXYData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$
  }).pipe(
    shareReplay(1)
  )

  const multiValueGraphicReverseScale$ = multiValueGraphicReverseScaleObservable({
    multiValueContainerPosition$: multiValueContainerPosition$,
    // multiValueAxesTransform$: multiValueAxesTransform$,
    multiValueGraphicTransform$: multiValueGraphicTransform$,
  })


  return <ContextObserverTypeMap<'multiValue', any>>{
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    textSizePx$,
    isCategorySeprate$,
    multiValueContainerPosition$,
    // multiValueAxesSize$,
    multiValueHighlight$,
    categoryLabels$,
    CategoryDataMap$,
    minMaxXY$,
    computedLayoutData$,
    visibleComputedData$,
    visibleComputedLayoutData$,
    filteredMinMaxXYData$,
    // multiValueAxesTransform$,
    // multiValueAxesReverseTransform$,
    multiValueGraphicTransform$,
    multiValueGraphicReverseScale$,
  }
}
