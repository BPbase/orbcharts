import type { ColorType, ComputedNode, ComputedEdge } from '../../lib/core-types'

export interface ForceDirectedParams {
  node: {
    dotRadius: number
    dotFillColorType: ColorType
    dotStrokeColorType: ColorType
    dotStrokeWidth: number
    dotStyleFn: (node: ComputedNode) => string
    labelColorType: ColorType
    labelSizeFixed: boolean
    labelStyleFn: (node: ComputedNode) => string
  }
  edge: {
    arrowColorType: ColorType
    arrowStrokeWidth: number
    arrowWidth: number
    arrowHeight: number
    arrowStyleFn: (node: ComputedNode) => string
    labelColorType: ColorType
    labelSizeFixed: boolean
    labelStyleFn: (node: ComputedNode) => string
  }
  force: {
    nodeStrength: number // 泡泡引力
    linkDistance: number // 距離
    velocityDecay: number // 衰減數
    alphaDecay: number // 衰減數
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

