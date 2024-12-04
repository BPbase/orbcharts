import { map, shareReplay, distinctUntilChanged } from 'rxjs'
import type { ContextObserverCallback, ContextObserverTypeMap } from '../../lib/core-types'
import {
  highlightObservable,
  categoryDataMapObservable,
  textSizePxObservable
} from '../utils/observables'
import {
  multiValueComputedLayoutDataObservable,
  multiValueAxesTransformObservable,
  multiValueAxesReverseTransformObservable,
  multiValueGraphicTransformObservable,
  multiValueGraphicReverseScaleObservable,
  multiValueAxesSizeObservable,
  multiValueCategoryLabelsObservable,
  multiValueVisibleComputedDataObservable,
  multiValueVisibleComputedLayoutDataObservable,
  multiValueContainerPositionObservable,

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

  const multiValueAxesTransform$ = multiValueAxesTransformObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$
  }).pipe(
    shareReplay(1)
  )

  const multiValueAxesReverseTransform$ = multiValueAxesReverseTransformObservable({
    multiValueAxesTransform$
  }).pipe(
    shareReplay(1)
  )
  
  const multiValueGraphicTransform$ = multiValueGraphicTransformObservable({
    computedData$: observer.computedData$,
    fullDataFormatter$: observer.fullDataFormatter$,
    layout$: observer.layout$
  }).pipe(
    shareReplay(1)
  )

  const multiValueGraphicReverseScale$ = multiValueGraphicReverseScaleObservable({
    multiValueContainerPosition$: multiValueContainerPosition$,
    multiValueAxesTransform$: multiValueAxesTransform$,
    multiValueGraphicTransform$: multiValueGraphicTransform$,
  })

  const multiValueAxesSize$ = multiValueAxesSizeObservable({
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

  const computedLayoutData$ = multiValueComputedLayoutDataObservable({
    computedData$: observer.computedData$,
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


  return <ContextObserverTypeMap<'multiValue', any>>{
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    computedData$: observer.computedData$,
    layout$: observer.layout$,
    textSizePx$,
    isCategorySeprate$,
    multiValueContainerPosition$,
    multiValueAxesTransform$,
    multiValueAxesReverseTransform$,
    multiValueGraphicTransform$,
    multiValueGraphicReverseScale$,
    multiValueAxesSize$,
    multiValueHighlight$,
    categoryLabels$,
    CategoryDataMap$,
    computedLayoutData$,
    visibleComputedData$,
    visibleComputedLayoutData$,
  }
}
