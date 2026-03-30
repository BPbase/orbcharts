
import { Observable, Subject } from 'rxjs'
import type { ColorType, ModelDatumSeries, EventData } from '../../../../core/src/types'
import type { AxisPosition, ContainerPosition, ContainerPositionScaled, Container, GraphicStyles, Layout, VisibleFilter, XYAxis, CategoryAxis } from '../../types/PluginParams'
import type { ComputedData, ComputedDatumGraphNode, ComputedDatumGraphEdge } from '../../types/'

export interface NetworkPlotExtendContext {
  layout$: Observable<Layout>
  computedData$: Observable<ComputedData<'graph'>>
  fontSizePx$: Observable<number>
  graphHighlightNodes$: Observable<ComputedDatumGraphNode[]>
  graphHighlightEdges$: Observable<ComputedDatumGraphEdge[]>
  categoryLabels$: Observable<string[]>
  CategoryNodeMap$: Observable<Map<string, ComputedDatumGraphNode[]>>
  CategoryEdgeMap$: Observable<Map<string, ComputedDatumGraphEdge[]>>
  NodeMap$: Observable<Map<string, ComputedDatumGraphNode>>
  EdgeMap$: Observable<Map<string, ComputedDatumGraphEdge>>
  visibleComputedData$: Observable<ComputedData<'graph'>>
}

// plugin params
export interface NetworkPlotPluginParams {
  styles: GraphicStyles
  visibleFilter: VisibleFilter<'grid'>
  datasetIndex: number
}

// all layer params
export interface NetworkPlotAllLayerParams {
  ForceDirected: ForceDirectedParams
  ForceDirectedBubbles: ForceDirectedBubblesParams
}

// -- layer params --
export interface ForceDirectedParams {
  // node: {
  //   dotRadius: number
  //   dotFillColorType: ColorType
  //   dotStrokeColorType: ColorType
  //   dotStrokeWidth: number
  //   dotStyleFn: (node: ComputedDatumGraphNode) => string
  //   labelColorType: ColorType
  //   labelSizeFixed: boolean
  //   labelStyleFn: (node: ComputedDatumGraphNode) => string
  // }
  dot: {
    radius: number
    fillColorType: ColorType
    strokeColorType: ColorType
    strokeWidth: number
    styleFn: (node: ComputedDatumGraphNode) => string
  }
  dotLabel: {
    colorType: ColorType
    sizeFixed: boolean
    styleFn: (node: ComputedDatumGraphNode) => string
  }
  // edge: {
  //   arrowColorType: ColorType
  //   arrowStrokeWidth: number
  //   arrowWidth: number
  //   arrowHeight: number
  //   arrowStyleFn: (node: ComputedDatumGraphNode) => string
  //   labelColorType: ColorType
  //   labelSizeFixed: boolean
  //   labelStyleFn: (node: ComputedDatumGraphNode) => string
  // }
  arrow: {
    colorType: ColorType
    strokeWidth: number
    pointerWidth: number
    pointerHeight: number
    styleFn: (edge: ComputedDatumGraphEdge) => string
  }
  arrowLabel: {
    colorType: ColorType
    sizeFixed: boolean
    styleFn: (edge: ComputedDatumGraphEdge) => string
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

export interface ForceDirectedBubblesParams {
  bubble: {
    radiusMin: number // 對應value最小值
    radiusMax: number // 對應value最大值
    arcScaleType: 'area' | 'radius'
    fillColorType: ColorType
    strokeColorType: ColorType
    strokeWidth: number
    styleFn: (node: ComputedDatumGraphNode) => string
  }
  bubbleLabel: {
    fillRate: number
    lineHeight: number
    maxLineLength: number
    wordBreakAll: boolean
    colorType: ColorType
    styleFn: (node: ComputedDatumGraphNode) => string
  }
  arrow: {
    colorType: ColorType
    strokeWidthMin: number // 對應value最小值
    strokeWidthMax: number // 對應value最大值
    pointerWidth: number
    pointerHeight: number
    styleFn: (edge: ComputedDatumGraphEdge) => string
  }
  arrowLabel: {
    colorType: ColorType
    sizeFixed: boolean
    styleFn: (edge: ComputedDatumGraphEdge) => string
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

