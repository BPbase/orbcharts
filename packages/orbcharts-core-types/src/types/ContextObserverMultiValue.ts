import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataMultiValue, ComputedDatumMultiValue } from './ComputedDataMultiValue'
import type { TransformData } from './TransformData'
import type { ContainerPositionScaled, ContainerSize } from './ContextObserver'

export interface ContextObserverMultiValue<PluginParams> extends ContextObserverBase<'multiValue', PluginParams> {
  textSizePx$: Observable<number>
  isCategorySeprate$: Observable<boolean>
  multiValueContainerPosition$: Observable<ContainerPositionScaled[]>
  multiValueContainerSize$: Observable<ContainerSize>
  // multiValueAxesSize$: Observable<{ width: number; height: number; }>
  multiValueHighlight$: Observable<ComputedDatumMultiValue[]>
  categoryLabels$: Observable<string[]>
  CategoryDataMap$: Observable<Map<string, ComputedDatumMultiValue[]>>
  xyMinMax$: Observable<{ // xy
    minX: number
    maxX: number
    minY: number
    maxY: number
  }>
  xyValueIndex$: Observable<[number, number]> // xy
  filteredXYMinMaxData$: Observable<{ // xy
    datumList: ComputedXYDatumMultiValue[]
    minXDatum: ComputedXYDatumMultiValue | null
    maxXDatum: ComputedXYDatumMultiValue | null
    minYDatum: ComputedXYDatumMultiValue | null
    maxYDatum: ComputedXYDatumMultiValue | null
  }>
  visibleComputedData$: Observable<ComputedDataMultiValue>
  computedXYData$: Observable<ComputedXYDataMultiValue> // xy
  visibleComputedXYData$: Observable<ComputedXYDataMultiValue> // xy
  // visibleComputedRankingData$: Observable<ComputedDatumMultiValue[]>// ranking
  // rankingScale$: Observable<d3.ScalePoint<string>> // ranking
  // multiValueAxesTransform$: Observable<TransformData>
  // multiValueAxesReverseTransform$: Observable<TransformData>
  multiValueGraphicTransform$: Observable<TransformData>
  multiValueGraphicReverseScale$: Observable<[number, number][]>
}

// export type MultiValueMinMaxData = {
//   minXDatum: ComputedXYDatumMultiValue
//   maxXDatum: ComputedXYDatumMultiValue
//   minYDatum: ComputedXYDatumMultiValue
//   maxYDatum: ComputedXYDatumMultiValue
// }

export type ComputedXYDataMultiValue = ComputedXYDatumMultiValue[][]

export interface ComputedXYDatumMultiValue extends ComputedDatumMultiValue {
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