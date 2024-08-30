import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { ContainerPosition } from './ContextObserverGrid'
import type { TransformData } from './TransformData'
import type { ContextObserverGridDetail } from './ContextObserverGrid'

export interface ContextObserverMultiGrid<PluginParams> extends ContextObserverBase<'multiGrid', PluginParams> {
  multiGridEachDetail$: Observable<ContextObserverGridDetail[]>
  multiGridContainer$: Observable<ContainerPosition[][]>
}

// export interface MultiGridObservableAll {
//   isSeriesPositionSeprate$: Observable<boolean>
//   gridContainer$: Observable<ContainerPosition[]>
//   gridAxesTransform$: Observable<TransformData>
//   gridAxesReverseTransform$: Observable<TransformData>
//   gridGraphicTransform$: Observable<TransformData>
//   gridGraphicReverseScale$: Observable<[number, number][]>
//   gridAxesSize$: Observable<{ width: number; height: number; }>
//   gridHighlight$: Observable<string[]>
//   existSeriesLabels$: Observable<string[]>
//   SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
//   GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
//   visibleComputedData$: Observable<ComputedDataGrid>
// }

