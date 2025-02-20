import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { DataFormatterGrid } from './DataFormatterGrid'
import type { ContextObserverGridDetail } from './ContextObserverGrid'
import type { ContainerPositionScaled } from './ContextObserver'
import type { ContainerSize } from './Common'

export interface ContextObserverMultiGrid<PluginParams> extends ContextObserverBase<'multiGrid', PluginParams> {
  textSizePx$: Observable<number>
  containerSize$: Observable<ContainerSize>
  multiGridHighlight$: Observable<ComputedDatumGrid[]>
  // seriesLabels$: Observable<string[]>
  multiGridContainerPosition$: Observable<ContainerPositionScaled[][]>
  // -- each grid --
  multiGridEachDetail$: Observable<ContextObserverMultiGridDetail[]>
}


export interface ContextObserverMultiGridDetail extends ContextObserverGridDetail {
  computedData$: Observable<ComputedDataGrid>
  dataFormatter$: Observable<DataFormatterGrid>
}