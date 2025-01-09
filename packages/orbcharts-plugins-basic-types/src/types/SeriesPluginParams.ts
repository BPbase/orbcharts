import type { ChartType, ComputedDatumSeries, EventSeries, EventName, ColorType } from '../../lib/core-types'
import type { BaseTooltipStyle, BaseTooltipUtils } from './BasePluginParams'
import type { ArcScaleType, Placement } from './Common'

export interface BubblesParams {
  force: {
    strength: number; // 泡泡引力
    velocityDecay: number; // 衰減數
    collisionSpacing: number // 泡泡間距
  }
  bubbleLabel: {
    fillRate: number
    lineHeight: number
    maxLineLength: number
    wordBreakAll: boolean
  }
  // highlightRIncrease: number
  arcScaleType: ArcScaleType
}

export interface PieParams {
  // padding: Padding
  outerRadius: number
  innerRadius: number
  outerRadiusWhileHighlight: number
  // label?: LabelStyle
  // enterDuration: number
  startAngle: number
  endAngle: number
  padAngle: number
  strokeColorType: ColorType
  strokeWidth: number
  // padRadius: number
  cornerRadius: number
}

export interface PieEventTextsParams {
  renderFn: (d: EventSeries) => string[] | string
  textAttrs: Array<{ [key:string]: string | number }>
  textStyles: Array<{ [key:string]: string | number }>
}

export interface PieLabelsParams {
  // solidColor?: string;
  // colors?: string[];
  outerRadius: number
  outerRadiusWhileHighlight: number
  // innerRadius?: number;
  // enterDuration?: number
  startAngle: number
  endAngle: number
  labelCentroid: number
  // fontSize?: number
  labelFn: ((d: ComputedDatumSeries) => string)
  labelColorType: ColorType
}

export interface RoseParams {
  outerRadius: number
  padAngle: number
  strokeColorType: ColorType
  strokeWidth: number
  cornerRadius: number
  arcScaleType: ArcScaleType
  angleIncreaseWhileHighlight: number
}

export interface RoseLabelsParams {
  outerRadius: number
  labelCentroid: number
  labelFn: ((d: ComputedDatumSeries) => string)
  labelColorType: ColorType
  arcScaleType: ArcScaleType
}

export interface SeriesLegendParams {
  // position: 'top' | 'bottom' | 'left' | 'right'
  // justify: 'start' | 'center' | 'end'
  placement: Placement
  padding: number
  backgroundFill: ColorType
  backgroundStroke: ColorType
  gap: number
  listRectWidth: number
  listRectHeight: number
  listRectRadius: number
  textColorType: ColorType
}

export interface SeriesTooltipParams {
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
      eventData: EventSeries,
      context: {
        styles: BaseTooltipStyle
        utils: BaseTooltipUtils
      }
    ) => string[] | string
  )
}
