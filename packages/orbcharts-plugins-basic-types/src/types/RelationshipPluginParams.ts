import type { ColorType, ComputedNode, EventRelationship } from '../../lib/core-types'
import type { BaseTooltipStyle, BaseTooltipUtils } from './BasePluginParams'

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