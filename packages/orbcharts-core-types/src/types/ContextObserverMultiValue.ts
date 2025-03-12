import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataMultiValue, ComputedDatumMultiValue, ComputedDatumWithSumMultiValue } from './ComputedDataMultiValue'
import type { TransformData } from './TransformData'
import type { ContainerPositionScaled } from './ContextObserver'
import type { ContainerSize } from './Common'

export interface ContextObserverMultiValue<PluginParams> extends ContextObserverBase<'multiValue', PluginParams> {
  textSizePx$: Observable<number>
  isCategorySeprate$: Observable<boolean>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  // multiValueAxesSize$: Observable<{ width: number; height: number; }>
  highlight$: Observable<ComputedDatumMultiValue[]>
  categoryLabels$: Observable<string[]>
  CategoryDataMap$: Observable<Map<string, ComputedDatumMultiValue[]>>
  valueLabels$: Observable<string[]>
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
  visibleComputedRankingByIndexData$: Observable<ComputedDatumMultiValue[][]> // ranking
  visibleComputedXYData$: Observable<ComputedXYDataMultiValue> // xy
  graphicTransform$: Observable<TransformData>
  graphicReverseScale$: Observable<[number, number][]>
  xScale$: Observable<d3.ScaleLinear<number, number>>
  // xSumScale$: Observable<d3.ScaleLinear<number, number>>
  yScale$: Observable<d3.ScaleLinear<number, number>>
  // -- ordinal --
  ordinalScaleDomain$: Observable<[number, number]>
  visibleComputedSumData$: Observable<ComputedDatumWithSumMultiValue[][]>
  visibleComputedRankingBySumData$: Observable<ComputedDatumWithSumMultiValue[][]> // ranking
  ordinalScale$: Observable<d3.ScaleLinear<number, number>>
  ordinalPadding$: Observable<number>
  // valueLabels$: Observable<string[]>
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