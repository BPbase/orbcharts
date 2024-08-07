import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { TransformData } from './TransformData'

export interface ContextObserverMultiGrid<PluginParams> extends ContextObserverBase<'multiGrid', PluginParams> {
  multiGrid$: Observable<MultiGridObservableAll[]>
}

export interface MultiGridObservableAll {
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridAxesOppositeTransform$: Observable<TransformData>
  gridAxesSize$: Observable<{ width: number; height: number; }>
  gridHighlight$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  visibleComputedData$: Observable<ComputedDataGrid>
}