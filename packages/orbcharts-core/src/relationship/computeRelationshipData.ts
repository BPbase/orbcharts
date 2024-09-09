import type { DataRelationship, DataRelationshipObj, DataRelationshipList, Node, Edge } from '../types/DataRelationship'
import type { ComputedDataFn } from '../types/ComputedData'
import type { ComputedDataRelationship, ComputedNode, ComputedEdge } from '../types/ComputedDataRelationship'

export const computeRelationshipData: ComputedDataFn<'relationship'> = (context) => {
  const { data, dataFormatter, chartParams } = context

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

    // -- nodes --
    computedNodes = nodes.map((node, i) => {
      const computedNode: ComputedNode = {
        id: node.id,
        index: i,
        label: node.label ?? '',
        description: node.description ?? '',
        // tooltipContent: node.tooltipContent ? node.tooltipContent : dataFormatter.tooltipContentFormat(node, 0, i, context), // 0代表node
        data: node.data ?? {},
        value: node.value ?? 0,
        categoryIndex: 0, // @Q@ 未完成
        categoryLabel: '', // @Q@ 未完成
        color: '', // @Q@ 未完成
        startNodes: [], // 後面再取得資料
        startNodeIds: [], // 後面再取得資料
        endNodes: [], // 後面再取得資料
        endNodeIds: [], // 後面再取得資料
        visible: true // 後面再取得資料
      }
      return computedNode
    })

    const NodesMap: Map<string, ComputedNode> = new Map(computedNodes.map(d => [d.id, d]))

    // -- edges --
    computedEdges = edges.map((edge, i) => {
      const computedEdge: ComputedEdge = {
        id: edge.id,
        index: i,
        label: edge.label ?? '',
        description: edge.description ?? '',
        // tooltipContent: edge.tooltipContent ? edge.tooltipContent : dataFormatter.tooltipContentFormat(edge, 1, i, context), // 1代表edge
        data: edge.data ?? {},
        value: edge.value ?? 0,
        startNode: NodesMap.get(edge.start),
        startNodeId: edge.start,
        endNode: NodesMap.get(edge.end),
        endNodeId: edge.end,
        visible: true // 先給預設值
      }

      return computedEdge
    })

    const StartNodesMap: Map<string, ComputedNode[]> = (function () {
      const _StartNodesMap = new Map()
      computedEdges.forEach(edge => {
        const startNodes: ComputedNode[] = _StartNodesMap.get(edge.endNodeId) ?? []
        startNodes.push(edge.startNode)
        _StartNodesMap.set(edge.endNodeId, startNodes)
      })
      return _StartNodesMap
    })()
    
    const EndNodesMap: Map<string, ComputedNode[]> = (function () {
      const _EndNodesMap = new Map()
      computedEdges.forEach(edge => {
        const endNodes: ComputedNode[] = _EndNodesMap.get(edge.startNodeId) ?? []
        endNodes.push(edge.endNode)
        _EndNodesMap.set(edge.startNodeId, endNodes)
      })
      return _EndNodesMap
    })()

    // -- 補齊nodes資料 --
    Array.from(NodesMap).forEach(([nodeId, node]) => {
      node.startNodes = StartNodesMap.get(nodeId)
      node.startNodeIds = node.startNodes.map(d => d.id)
      node.endNodes = EndNodesMap.get(nodeId)
      node.endNodeIds = node.endNodes.map(d => d.id)
      node.visible = dataFormatter.visibleFilter(node, context)
    })

    // -- 補齊edges資料 --
    computedEdges = computedEdges.map(edge => {
      edge.visible = edge.startNode.visible && edge.endNode.visible
        ? true
        : false
      return edge
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
