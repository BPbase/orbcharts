import type { ColorType, ComputedNode, ComputedEdge } from '../../lib/core-types'

export interface ForceDirectedParams {
  node: {
    dotFillColorType: ColorType
    dotStrokeColorType: ColorType
    dotStrokeWidth: number
    dotStyleFn: (node: ComputedNode) => string
    labelColorType: ColorType
    nodeStyleFn: (node: ComputedNode) => string
  }
  edge: {
    arrowColorType: ColorType
    arrowStrokeWidth: number
    arrowWidth: number
    arrowHeight: number
    arrowStyleFn: (node: ComputedNode) => string
    labelColorType: ColorType
    labelStyleFn: (node: ComputedNode) => string
  }
  zoomable: boolean
  transform: {
    x: number
    y: number
    k: number
  }
  scaleExtent: {
    min: number
    max: number
  }
}

