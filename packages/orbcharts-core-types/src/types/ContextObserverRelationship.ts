import type { Observable } from 'rxjs'
import type { ContextObserverBase } from './ContextObserver'
import type { ComputedDataRelationship, ComputedNode, ComputedEdge } from './ComputedDataRelationship'

export interface ContextObserverRelationship<PluginParams> extends ContextObserverBase<'relationship', PluginParams> {
  textSizePx$: Observable<number>
  relationshipHighlightNodes$: Observable<ComputedNode[]>
  relationshipHighlightEdges$: Observable<ComputedEdge[]>
  categoryLabels$: Observable<string[]>
  CategoryNodeMap$: Observable<Map<string, ComputedNode[]>>
  CategoryEdgeMap$: Observable<Map<string, ComputedEdge[]>>
  NodeMap$: Observable<Map<string, ComputedNode>>
  EdgeMap$: Observable<Map<string, ComputedEdge>>
  visibleComputedData$: Observable<ComputedDataRelationship>
}