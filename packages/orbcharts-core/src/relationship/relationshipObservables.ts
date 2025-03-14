import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable } from 'rxjs'
import type {
  ChartParams,
  ComputedDataRelationship,
  ComputedDataTypeMap,
  ComputedNode,
  ComputedEdge,
  DataFormatterTree } from '../../lib/core-types'


export const categoryLabelsObservable = (
  CategoryNodeMap$: Observable<Map<string, ComputedNode[]>>,
  CategoryEdgeMap$: Observable<Map<string, ComputedEdge[]>>
): Observable<string[]> => {
  return combineLatest({
    CategoryNodeMap: CategoryNodeMap$,
    CategoryEdgeMap: CategoryEdgeMap$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return [...Array.from(data.CategoryNodeMap.keys()), ...Array.from(data.CategoryEdgeMap.keys())]
    }),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a) === JSON.stringify(b)
    }),
  )
}

export const NodeMapObservable = (computedData$: Observable<ComputedDataRelationship>) => {
  return computedData$.pipe(
    map(data => {
      const nodeMap = new Map<string, ComputedNode>()
      data.nodes.forEach(node => {
        nodeMap.set(node.id, node)
      })
      return nodeMap
    }),
  )
}

export const EdgeMapObservable = (computedData$: Observable<ComputedDataRelationship>) => {
  return computedData$.pipe(
    map(data => {
      const edgeMap = new Map<string, ComputedEdge>()
      data.edges.forEach(edge => {
        edgeMap.set(edge.id, edge)
      })
      return edgeMap
    }),
  )
}

// 所有可見的節點
export const relationshipVisibleComputedDataObservable = ({ computedData$, NodeMap$ }: {
  computedData$: Observable<ComputedDataRelationship>
  NodeMap$: Observable<Map<string, ComputedNode>>
}) => {
  return combineLatest({
    computedData: computedData$,
    NodeMap: NodeMap$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return {
        nodes: data.computedData.nodes.filter(node => node.visible),
        edges: data.computedData.edges
          .filter(edge => edge.visible)
          // 依照節點是否存在篩選
          .filter(edge => {
            return data.NodeMap.has(edge.startNode.id) && data.NodeMap.has(edge.endNode.id)
          })
      }
    })
  )
}