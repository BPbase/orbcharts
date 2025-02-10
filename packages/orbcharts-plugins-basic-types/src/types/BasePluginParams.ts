import type { ChartType, EventTypeMap, ColorType } from '../../lib/core-types'
import type { Placement } from './Common'


export interface BaseBarsParams {
  // barType: BarType
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  barRadius: number | boolean
}

export interface BaseStackedBarParams {
  barWidth: number
  barGroupPadding: number
  barRadius: number | boolean
}

export interface BaseBarsTriangleParams {
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  linearGradientOpacity: [number, number]
}

export interface BaseDotsParams {
  radius: number
  fillColorType: ColorType
  strokeColorType: ColorType
  strokeWidth: number
  // strokeWidthWhileHighlight: number
  onlyShowHighlighted: boolean
}

export interface BaseGroupAxisParams {
  // xLabel: string
  // labelAnchor: 'start' | 'end'
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  ticks: number | null | 'all'
  tickFormat: string | ((text: any) => string | d3.NumberValue)
  tickLineVisible: boolean
  tickPadding: number
  tickFullLine: boolean
  tickFullLineDasharray: string
  tickColorType: ColorType
  // axisLineColor: string
  // axisLabelColor: string
  tickTextRotate: number
  tickTextColorType: ColorType
}

export interface BaseLegendParams {
  // position: 'top' | 'bottom' | 'left' | 'right'
  // justify: 'start' | 'center' | 'end'
  placement: Placement
  padding: number
  // offset: [number, number]
  backgroundFill: ColorType
  backgroundStroke: ColorType
  textColorType: ColorType
  gap: number
  labelList: Array<{
    listRectWidth: number
    listRectHeight: number
    listRectRadius: number
  }>
  // highlightEvent: boolean
}

export interface BaseLineAreasParams {
  lineCurve: string
  // lineWidth: number
  linearGradientOpacity: [number, number]
}

export interface BaseLinesParams {
  // lineType: LineType
  lineCurve: string
  lineWidth: number
  // labelFn: (d: ComputedDatumSeries) => string
  // labelPositionFn: (d: ComputedDatumSeries) => 'top' | 'bottom' | 'left' | 'right' | 'center'
  // labelStyleFn: (d: ComputedDatumSeries) => string
  // labelFontSizeFn: (d: ComputedDatumSeries) => number
  // labelColorFn: (d: ComputedDatumSeries) => string
  // labelPadding: number
}

export interface BaseRankingAxisParams {
  // labelOffset: [number, number]
  // labelColorType: ColorType
  // axisLineVisible: boolean
  // axisLineColorType: ColorType
  // // ticks: number | null
  // // tickFormat: string | ((text: d3.NumberValue) => string | d3.NumberValue)
  // tickLineVisible: boolean
  // tickPadding: number
  // // tickFullLine: boolean
  // // tickFullLineDasharray: string
  // tickColorType: ColorType
  // tickTextRotate: number
  // tickTextColorType: ColorType
  barLabel: {
    padding: number
    rotate: number
    colorType: ColorType
  }
  axisLabel: {
    offset: [number, number]
    colorType: ColorType
  }
  valueIndex: number | 'sum'
}

export interface BaseRankingBarsParams {
  bar: {
    barWidth: number
    barPadding: number
    // barRadius: number | boolean
  }
  rankingAmount: 'auto' | number
}

export interface BaseTooltipStyle {
  backgroundColor: string
  backgroundOpacity: number
  strokeColor: string
  offset: [number, number]
  padding: number
  textColor: string
  textSize: number | string // chartParams上的設定
  textSizePx: number
  seriesColors: string[]
}

export interface BaseTooltipUtils {
  measureTextWidth (text: string, size?: number): number
}

export type BaseTooltipParams = {
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
      eventData: EventTypeMap<any>,
      context: {
        styles: BaseTooltipStyle
        utils: BaseTooltipUtils
      }
    ) => string[] | string
  )
}

export interface BaseValueAxisParams {
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  ticks: number
  tickFormat: string | ((text: d3.NumberValue) => string | d3.NumberValue)
  tickLineVisible: boolean
  tickPadding: number
  tickFullLine: boolean
  tickFullLineDasharray: string
  tickColorType: ColorType
  tickTextRotate: number
  tickTextColorType: ColorType
}

export interface BaseXAxisParams {
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  ticks: number | null
  tickFormat: string | ((text: d3.NumberValue) => string | d3.NumberValue)
  tickLineVisible: boolean
  tickPadding: number
  tickFullLine: boolean
  tickFullLineDasharray: string
  tickColorType: ColorType
  // axisLineColor: string
  // axisLabelColor: string
  // tickTextRotate: number
  tickTextColorType: ColorType
}

export interface BaseYAxisParams {
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  ticks: number | null
  tickFormat: string | ((text: d3.NumberValue) => string | d3.NumberValue)
  tickLineVisible: boolean
  tickPadding: number
  tickFullLine: boolean
  tickFullLineDasharray: string
  tickColorType: ColorType
  // axisLineColor: string
  // axisLabelColor: string
  // tickTextRotate: number
  tickTextColorType: ColorType
}