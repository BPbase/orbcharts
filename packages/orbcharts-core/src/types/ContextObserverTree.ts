import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataTree } from './ComputedDataTree'

export interface ContextObserverTree<PluginParams> extends ContextObserverBase<'tree', PluginParams> {
  textSizePx$: Observable<number>
  treeHighlight$: Observable<ComputedDataTree[]>
  existCategoryLabels$: Observable<string[]>
  CategoryDataMap$: Observable<Map<string, ComputedDataTree[]>>
  visibleComputedData$: Observable<ComputedDataTree>
}
