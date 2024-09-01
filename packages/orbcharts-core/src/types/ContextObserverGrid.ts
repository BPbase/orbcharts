import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { TransformData } from './TransformData'

export interface ContextObserverGrid<PluginParams>
  extends
    ContextObserverBase<'grid', PluginParams>,
    ContextObserverGridDetail {
  
    }

export interface ContextObserverGridDetail {
  gridContainer$: Observable<ContainerPosition[]>
  gridAxesTransform$: Observable<TransformData>
  gridAxesReverseTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridGraphicReverseScale$: Observable<[number, number][]>
  gridAxesSize$: Observable<{ width: number; height: number; }>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  existSeriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  visibleComputedData$: Observable<ComputedDataGrid>
  isSeriesPositionSeprate$: Observable<boolean>
}

export interface ContainerPosition {
  slotIndex: number
  rowIndex: number
  columnIndex: number
  translate: [number, number]
  scale: [number, number]
}