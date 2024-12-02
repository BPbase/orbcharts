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
  gridAxesTransform$: Observable<TransformData>
  gridAxesReverseTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridGraphicReverseScale$: Observable<[number, number][]>
  gridAxesSize$: Observable<{ width: number; height: number; }>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  computedLayoutData$: Observable<ComputedLayoutDataGrid>
  visibleComputedData$: Observable<ComputedDataGrid>
  visibleComputedLayoutData$: Observable<ComputedLayoutDataGrid>
  computedStackedData$: Observable<ComputedDataGrid>
}

export type ComputedLayoutDataGrid = ComputedLayoutDatumGrid[][]

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