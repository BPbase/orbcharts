import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { DataFormatterGrid } from './DataFormatterGrid'
import type { GridContainerPosition, ContextObserverGridDetail } from './ContextObserverGrid'

export interface ContextObserverMultiGrid<PluginParams> extends ContextObserverBase<'multiGrid', PluginParams> {
  textSizePx$: Observable<number>
  multiGridContainerPosition$: Observable<GridContainerPosition[][]>
  multiGridEachDetail$: Observable<ContextObserverMultiGridDetail[]>
}


export interface ContextObserverMultiGridDetail extends ContextObserverGridDetail {
  computedData$: Observable<ComputedDataGrid>
  dataFormatter$: Observable<DataFormatterGrid>
}