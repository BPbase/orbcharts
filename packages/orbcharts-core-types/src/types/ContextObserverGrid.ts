import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { TransformData } from './TransformData'
import type { ContainerPositionScaled } from './ContextObserver'

export interface ContextObserverGrid<PluginParams> extends
ContextObserverBase<'grid', PluginParams>, ContextObserverGridDetail {
  textSizePx$: Observable<number>
}

export interface ContextObserverGridDetail {
  isSeriesSeprate$: Observable<boolean>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  gridAxesSize$: Observable<{ width: number; height: number; }>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  computedAxesData$: Observable<ComputedAxesDataGrid> // 有座標的資料
  visibleComputedData$: Observable<ComputedDataGrid> // filter掉visible=false的資料
  visibleComputedAxesData$: Observable<ComputedAxesDataGrid>
  computedStackedData$: Observable<ComputedDataGrid>
  groupScaleDomainValue$: Observable<[number, number]>
  filteredMinMaxValue$: Observable<[number, number]>
  gridAxesTransform$: Observable<TransformData>
  gridAxesReverseTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridGraphicReverseScale$: Observable<[number, number][]>
  // filteredMinMaxData$: Observable<{ minValueDatum: ComputedLayoutDatumGrid; maxValueDatum: ComputedLayoutDatumGrid }>
}

export type ComputedAxesDataGrid = ComputedLayoutDatumGrid[][]

export interface ComputedLayoutDatumGrid extends ComputedDatumGrid {
  axisX: number
  axisY: number
  axisYFromZero: number
}

// export interface GridContainerPosition {
//   slotIndex: number
//   rowIndex: number
//   columnIndex: number
//   translate: [number, number]
//   scale: [number, number]
// }