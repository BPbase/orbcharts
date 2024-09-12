import type { ComputedDatumSeries, EventSeries, EventName, ColorType } from '@orbcharts/core'
// import type { BaseLegendParams } from '../base/BaseLegend'

export type ArcScaleType = 'area' | 'radius'

export interface BubblesParams {
  force: {
    strength: number; // 泡泡引力
    velocityDecay: number; // 衰減數
    collisionSpacing: number // 泡泡間距
  }
  bubbleText: {
    fillRate: number
    lineHeight: number
    lineLengthMin: number
  }
  highlightRIncrease: number
  arcScaleType: ArcScaleType
}

export interface PieParams {
  // padding: Padding
  outerRadius: number;
  innerRadius: number;
  mouseoverOuterRadius: number;
  // label?: LabelStyle
  // enterDuration: number
  startAngle: number
  endAngle: number
  padAngle: number
  // padRadius: number
  cornerRadius: number
}

export interface PieEventTextsParams {
  eventFn: (d: EventSeries, eventName: EventName, t: number) => string[]
  textAttrs: Array<{ [key:string]: string | number }>
  textStyles: Array<{ [key:string]: string | number }>
}

export interface PieLabelsParams {
  // solidColor?: string;
  // colors?: string[];
  outerRadius: number
  mouseoverOuterRadius: number
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
  // padAngle: number
  cornerRadius: number
  arcScaleType: ArcScaleType
  mouseoverAngleIncrease: number
}

export interface RoseLabelsParams {
  outerRadius: number
  labelCentroid: number
  labelFn: ((d: ComputedDatumSeries) => string)
  labelColorType: ColorType
  arcScaleType: ArcScaleType
}

export interface SeriesLegendParams {
  position: 'top' | 'bottom' | 'left' | 'right'
  justify: 'start' | 'center' | 'end'
  padding: number
  backgroundFill: ColorType
  backgroundStroke: ColorType
  gap: number
  listRectWidth: number
  listRectHeight: number
  listRectRadius: number
  textColorType: ColorType
}
