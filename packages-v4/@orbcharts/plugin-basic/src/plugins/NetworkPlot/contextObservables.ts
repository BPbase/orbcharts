import {
  combineLatest,
  distinctUntilChanged,
  debounceTime,
  filter,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable } from 'rxjs'
import type { ModelData, ModelDatumSeries } from '@orbcharts/core'
import type {
  ComputedData,
  ComputedDatumGraphNode,
  ComputedDatumGraphEdge,
} from '../../types'
import { NetworkPlotPluginParams } from './types'

export const multivariateComputedDataObservable = ({ selectedGraphData$, pluginParams$ }: {
  selectedGraphData$: Observable<ModelData<'graph'>>
  pluginParams$: Observable<NetworkPlotPluginParams>
}): Observable<ComputedData<'graph'>> => {
  return combineLatest({
    selectedGraphData: selectedGraphData$,
    pluginParams: pluginParams$
  }).pipe(
    debounceTime(0),
    map(({ selectedGraphData, pluginParams }) => {
      const filteredNodes = selectedGraphData.nodes.map((datum, index) => {
        const visibleFilter = pluginParams.visibleFilter
        return {
          ...datum,
          visible: visibleFilter ? visibleFilter(datum) : true,
        }
      })
      const NodesMap: Map<string, ComputedDatumGraphNode> = new Map(
        filteredNodes.map(d => [d.id, d])
      )
      const filteredEdges = selectedGraphData.edges.map((datum, index) => {
        const sourceNode = NodesMap.get(datum.source)
        const targetNode = NodesMap.get(datum.target)
        return {
          ...datum,
          visible: sourceNode && targetNode && sourceNode.visible && targetNode.visible
            ? true
            : false
        }
      })
      return {
        nodes: filteredNodes,
        edges: filteredEdges
      }
    })
  )
}

export const categoryLabelsObservable = (
  CategoryNodeMap$: Observable<Map<string, ComputedDatumGraphNode[]>>,
  CategoryEdgeMap$: Observable<Map<string, ComputedDatumGraphEdge[]>>
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

export const NodeMapObservable = (computedData$: Observable<ComputedData<'graph'>>) => {
  return computedData$.pipe(
    map(data => {
      const nodeMap = new Map<string, ComputedDatumGraphNode>()
      data.nodes.forEach(node => {
        nodeMap.set(node.id, node)
      })
      return nodeMap
    }),
  )
}

export const EdgeMapObservable = (computedData$: Observable<ComputedData<'graph'>>) => {
  return computedData$.pipe(
    map(data => {
      const edgeMap = new Map<string, ComputedDatumGraphEdge>()
      data.edges.forEach(edge => {
        edgeMap.set(edge.id, edge)
      })
      return edgeMap
    }),
  )
}

// 所有可見的節點
export const graphVisibleComputedDataObservable = ({ computedData$, NodeMap$ }: {
  computedData$: Observable<ComputedData<'graph'>>
  NodeMap$: Observable<Map<string, ComputedDatumGraphNode>>
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
            return data.NodeMap.has(edge.source) && data.NodeMap.has(edge.target)
          })
      }
    })
  )
}