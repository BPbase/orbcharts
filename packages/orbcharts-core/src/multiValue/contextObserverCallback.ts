import type { ContextObserverCallback } from '../../lib/core-types'

export const contextObserverCallback: ContextObserverCallback<'multiValue'> = ({ subject, observer }) => {

  return {
    textSizePx$: Observable<number>
    isCategorySeprate$: Observable<boolean>
    multiValueContainerPosition$: Observable<MultiValueContainerPosition[]>
    multiValueAxesTransform$: Observable<TransformData>
    multiValueAxesReverseTransform$: Observable<TransformData>
    multiValueGraphicTransform$: Observable<TransformData>
    multiValueGraphicReverseScale$: Observable<[number, number][]>
    multiValueAxesSize$: Observable<{ width: number; height: number; }>
    multiValueHighlight$: Observable<ComputedDatumMultiValue[]>
    categoryLabels$: Observable<string[]>
    CategoryDataMap$: Observable<Map<string, ComputedDatumMultiValue[]>>
    visibleComputedData$: Observable<ComputedDatumMultiValue[][]>
    computedLayoutData$: Observable<ComputedDatumMultiValue[][]>
    visibleComputedLayoutData$: Observable<ComputedDatumMultiValue[][]>
  }
}
