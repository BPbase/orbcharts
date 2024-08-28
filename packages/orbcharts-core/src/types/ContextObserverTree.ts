import { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataTree } from './ComputedDataTree'

export interface ContextObserverTree<PluginParams> extends ContextObserverBase<'tree', PluginParams> {
  treeHighlight$: Observable<string[]>
  existCategoryLabels$: Observable<string[]>
  CategoryDataMap$: Observable<Map<string, ComputedDataTree[]>>
  visibleComputedData$: Observable<ComputedDataTree>
}
