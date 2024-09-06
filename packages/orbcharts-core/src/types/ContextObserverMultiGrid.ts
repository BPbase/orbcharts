import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { DataFormatterGrid } from './DataFormatterGrid'
import type { ContainerPosition } from './ContextObserverGrid'
import type { TransformData } from './TransformData'
import type { ContextObserverGridDetail } from './ContextObserverGrid'

export interface ContextObserverMultiGrid<PluginParams> extends ContextObserverBase<'multiGrid', PluginParams> {
  textSizePx$: Observable<number>
  multiGridEachDetail$: Observable<ContextObserverMultiGridDetail[]>
  multiGridContainer$: Observable<ContainerPosition[][]>
}


export interface ContextObserverMultiGridDetail extends ContextObserverGridDetail {
  computedData$: Observable<ComputedDataGrid>
  dataFormatter$: Observable<DataFormatterGrid>
}