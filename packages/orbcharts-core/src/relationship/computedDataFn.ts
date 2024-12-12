import type {
  DataRelationshipObj,
  DataRelationshipList,
  Node,
  Edge,
  ComputedDataFn,
  ComputedDataRelationship,
  ComputedNode,
  ComputedEdge
} from '../../lib/core-types'
import { createDefaultCategoryLabel, seriesColorPredicate } from '../utils/orbchartsUtils'

export const computedDataFn: ComputedDataFn<'relationship'> = (context) => {
  const { data, dataFormatter, chartParams } = context

  const defaultCategoryLabel = createDefaultCategoryLabel()

  let computedNodes: ComputedNode[] = []
  let computedEdges: ComputedEdge[] = []

  try {
    // -- 取得nodes和edges資料 --
    let nodes: Node[] = []
    let edges: Edge[] = []
    if ((data as DataRelationshipObj).nodes) {
      nodes = (data as DataRelationshipObj).nodes
      edges = (data as DataRelationshipObj).edges
    } else if ((data as DataRelationshipList)[0]) {
      nodes = (data as DataRelationshipList)[0]
      edges = (data as DataRelationshipList)[1]
    } else {
      // 無值直接回傳
      return {
        nodes: [],
        edges: []
      } as ComputedDataRelationship
    }

    const categoryLabels = (() => {
      // 先使用 dataFormatter.categoryLabels
      const CategoryLabelsSet = new Set(dataFormatter.categoryLabels)
      // 再加入 datum 中的 categoryLabel
      for (let datum of nodes) {
        const categoryLabel = datum.categoryLabel ?? defaultCategoryLabel
        CategoryLabelsSet.add(categoryLabel) // 不重覆
      }
      for (let datum of edges) {
        const categoryLabel = datum.categoryLabel ?? defaultCategoryLabel
        CategoryLabelsSet.add(categoryLabel) // 不重覆
      }
      return Array.from(CategoryLabelsSet)
    })()
    
    // <categoryLabel, categoryIndex>
    const CategoryIndexMap = new Map<string, number>(
      categoryLabels.map((label, index) => [label, index])
    )

    // -- nodes --
    computedNodes = nodes.map((node, i) => {
      const categoryLabel = node.categoryLabel ?? defaultCategoryLabel
      
      const computedNode: ComputedNode = {
        id: node.id,
        index: i,
        label: node.label ?? '',
        description: node.description ?? '',
        data: node.data ?? {},
        value: node.value ?? 0,
        categoryIndex: CategoryIndexMap.get(categoryLabel),
        categoryLabel,
        color: seriesColorPredicate(i, chartParams),
        // startNodes: [], // 後面再取得資料
        // startNodeIds: [], // 後面再取得資料
        // endNodes: [], // 後面再取得資料
        // endNodeIds: [], // 後面再取得資料
        visible: true // 先給預設值
      }
      
      computedNode.visible = dataFormatter.visibleFilter(computedNode, context)

      return computedNode
    })

    const NodesMap: Map<string, ComputedNode> = new Map(computedNodes.map(d => [d.id, d]))

    // const StartNodesMap: Map<string, ComputedNode[]> = (function () {
    //   const _StartNodesMap = new Map()
    //   computedEdges.forEach(edge => {
    //     const startNodes: ComputedNode[] = _StartNodesMap.get(edge.endNodeId) ?? []
    //     startNodes.push(edge.startNode)
    //     _StartNodesMap.set(edge.endNodeId, startNodes)
    //   })
    //   return _StartNodesMap
    // })()
    
    // const EndNodesMap: Map<string, ComputedNode[]> = (function () {
    //   const _EndNodesMap = new Map()
    //   computedEdges.forEach(edge => {
    //     const endNodes: ComputedNode[] = _EndNodesMap.get(edge.startNodeId) ?? []
    //     endNodes.push(edge.endNode)
    //     _EndNodesMap.set(edge.startNodeId, endNodes)
    //   })
    //   return _EndNodesMap
    // })()

    // -- edges --
    computedEdges = edges.map((edge, i) => {
      const categoryLabel = edge.categoryLabel ?? defaultCategoryLabel
      const startNode = NodesMap.get(edge.start)
      const endNode = NodesMap.get(edge.end)

      const computedEdge: ComputedEdge = {
        id: edge.id,
        index: i,
        label: edge.label ?? '',
        description: edge.description ?? '',
        data: edge.data ?? {},
        value: edge.value ?? 0,
        categoryIndex: CategoryIndexMap.get(categoryLabel),
        categoryLabel,
        color: seriesColorPredicate(i, chartParams),
        startNode,
        // startNodeId: edge.start,
        endNode,
        // endNodeId: edge.end,
        visible: startNode.visible && endNode.visible
      }

      return computedEdge
    })

    
  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return {
    nodes: computedNodes,
    edges: computedEdges
  }
}
