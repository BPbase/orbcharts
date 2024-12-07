import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataMultiValue, ComputedDatumMultiValue } from './ComputedDataMultiValue'
import type { TransformData } from './TransformData'
import type { ContainerPositionScaled } from './ContextObserver'

export interface ContextObserverMultiValue<PluginParams> extends ContextObserverBase<'multiValue', PluginParams> {
  textSizePx$: Observable<number>
  isCategorySeprate$: Observable<boolean>
  multiValueContainerPosition$: Observable<ContainerPositionScaled[]>
  // multiValueAxesTransform$: Observable<TransformData>
  // multiValueAxesReverseTransform$: Observable<TransformData>
  multiValueGraphicTransform$: Observable<TransformData>
  multiValueGraphicReverseScale$: Observable<[number, number][]>
  // multiValueAxesSize$: Observable<{ width: number; height: number; }>
  multiValueHighlight$: Observable<ComputedDatumMultiValue[]>
  categoryLabels$: Observable<string[]>
  CategoryDataMap$: Observable<Map<string, ComputedDatumMultiValue[]>>
  visibleComputedData$: Observable<ComputedDataMultiValue>
  computedLayoutData$: Observable<ComputedDataMultiValue>
  visibleComputedLayoutData$: Observable<ComputedDataMultiValue>
}

export type ComputedLayoutDataMultiValue = ComputedLayoutDatumMultiValue[][]

export interface ComputedLayoutDatumMultiValue extends ComputedDatumMultiValue {
  axisX: number
  axisY: number
}

// export interface MultiValueContainerPosition {
//   slotIndex: number
//   rowIndex: number
//   columnIndex: number
//   translate: [number, number]
//   scale: [number, number]
// }