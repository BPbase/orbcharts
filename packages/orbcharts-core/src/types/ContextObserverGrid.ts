import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { TransformData } from './TransformData'

export interface ContextObserverGrid<PluginParams> extends ContextObserverBase<'grid', PluginParams> {
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridAxesOppositeTransform$: Observable<TransformData>
  gridAxesSize$: Observable<{ width: number; height: number; }>
  gridHighlight$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  visibleComputedData$: Observable<ComputedDataGrid>
}

