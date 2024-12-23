import type { ColorType, ComputedNode, EventRelationship } from '../../lib/core-types'
import type { BaseTooltipStyle, BaseTooltipUtils } from './BasePluginParams'

export interface ForceDirectedParams {
  // node: {
  //   dotRadius: number
  //   dotFillColorType: ColorType
  //   dotStrokeColorType: ColorType
  //   dotStrokeWidth: number
  //   dotStyleFn: (node: ComputedNode) => string
  //   labelColorType: ColorType
  //   labelSizeFixed: boolean
  //   labelStyleFn: (node: ComputedNode) => string
  // }
  dot: {
    radius: number
    fillColorType: ColorType
    strokeColorType: ColorType
    strokeWidth: number
    styleFn: (node: ComputedNode) => string
  }
  dotLabel: {
    colorType: ColorType
    sizeFixed: boolean
    styleFn: (node: ComputedNode) => string
  }
  // edge: {
  //   arrowColorType: ColorType
  //   arrowStrokeWidth: number
  //   arrowWidth: number
  //   arrowHeight: number
  //   arrowStyleFn: (node: ComputedNode) => string
  //   labelColorType: ColorType
  //   labelSizeFixed: boolean
  //   labelStyleFn: (node: ComputedNode) => string
  // }
  arrow: {
    colorType: ColorType
    strokeWidth: number
    pointerWidth: number
    pointerHeight: number
    styleFn: (node: ComputedNode) => string
  }
  arrowLabel: {
    colorType: ColorType
    sizeFixed: boolean
    styleFn: (node: ComputedNode) => string
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
    styleFn: (node: ComputedNode) => string
  }
  bubbleLabel: {
    fillRate: number
    lineHeight: number
    maxLineLength: number
    wordBreakAll: boolean
    colorType: ColorType
    styleFn: (node: ComputedNode) => string
  }
  arrow: {
    colorType: ColorType
    strokeWidthMin: number // 對應value最小值
    strokeWidthMax: number // 對應value最大值
    pointerWidth: number
    pointerHeight: number
    styleFn: (node: ComputedNode) => string
  }
  arrowLabel: {
    colorType: ColorType
    sizeFixed: boolean
    styleFn: (node: ComputedNode) => string
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

export interface RelationshipLegendParams {
  // position: 'top' | 'bottom' | 'left' | 'right'
  // justify: 'start' | 'center' | 'end'
  placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
  padding: number
  backgroundFill: ColorType
  backgroundStroke: ColorType
  gap: number
  listRectWidth: number
  listRectHeight: number
  listRectRadius: number
  textColorType: ColorType
}

export interface RelationshipTooltipParams {
  backgroundColorType: ColorType
  backgroundOpacity: number
  strokeColorType: ColorType
  textColorType: ColorType
  offset: [number, number]
  padding: number
  // textRenderFn: (<T extends ChartType>(eventData: EventTypeMap<T>) => string[] | string) | null
  // svgRenderFn: (<T extends ChartType>(eventData: EventTypeMap<T>) => string) | null
  renderFn: (
    (
      eventData: EventRelationship,
      context: {
        styles: BaseTooltipStyle
        utils: BaseTooltipUtils
      }
    ) => string[] | string
  )
}