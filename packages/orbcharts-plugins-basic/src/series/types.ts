import type { ComputedDatumSeries, EventSeries, EventName, ColorType } from '@orbcharts/core'

export type ScaleType = 'area' | 'radius'

export interface BubblesPluginParams {
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
  scaleType: ScaleType
}

export interface PiePluginParams {
  // padding: Padding
  outerRadius: number;
  innerRadius: number;
  outerMouseoverRadius: number;
  // label?: LabelStyle
  enterDuration: number
  startAngle: number
  endAngle: number
  padAngle: number
  // padRadius: number
  cornerRadius: number
}

export interface PieEventTextsPluginParams {
  eventFn: (d: EventSeries, eventName: EventName, t: number) => string[]
  textAttrs: Array<{ [key:string]: string | number }>
  textStyles: Array<{ [key:string]: string | number }>
}

export interface PieLabelsPluginParams {
  // solidColor?: string;
  // colors?: string[];
  outerRadius: number
  outerMouseoverRadius: number
  // innerRadius?: number;
  // enterDuration?: number
  startAngle: number
  endAngle: number
  labelCentroid: number
  // fontSize?: number
  labelFn: ((d: ComputedDatumSeries) => string)
  labelColorType: ColorType
}

export interface SeriesLegendParams {
  position: 'top' | 'bottom' | 'left' | 'right'
  // position: 'bottom' | 'right'
  justify: 'start' | 'center' | 'end'
  padding: number
  offset: [number, number]
  gap: number
  // seriesLabels: string[]
  // rectWidth: number
  rectRadius: number
  highlightEvent: boolean
}
