import type { ColorType } from '@orbcharts/core'
// import type { BaseLegendParams } from '../base/BaseLegend'

// export type LineType = 'line' | 'area' | 'gradientArea'
// export type BarType = 'rect' | 'triangle'

export interface LinesParams {
  lineCurve: string
  lineWidth: number
  // labelFn: (d: ComputedDatumSeries) => string
  // labelPositionFn: (d: ComputedDatumSeries) => 'top' | 'bottom' | 'left' | 'right' | 'center'
  // labelStyleFn: (d: ComputedDatumSeries) => string
  // labelFontSizeFn: (d: ComputedDatumSeries) => number
  // labelColorFn: (d: ComputedDatumSeries) => string
  // labelPadding: number
}

export interface LineAreasParams {
  lineCurve: string
  linearGradientOpacity: [number, number]
}

export interface DotsParams {
  radius: number
  fillColorType: ColorType
  strokeColorType: ColorType
  strokeWidth: number
  // strokeWidthWhileHighlight: number
  onlyShowHighlighted: boolean
}

export interface GroupAuxParams {
  showLine: boolean
  showLabel: boolean
  lineDashArray: string
  lineColorType: ColorType
  labelColorType: ColorType
  labelTextColorType: ColorType
  labelTextFormat: string | ((text: any) => string)
  labelPadding: number
  labelRotate: number
}

export interface BarsParams {
  // barType: BarType
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  barRadius: number | boolean
}

export interface BarsPNParams extends BarsParams {}

export interface BarStackParams {
  barWidth: number
  barGroupPadding: number
  barRadius: number | boolean
}

export interface BarsTriangleParams {
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  linearGradientOpacity: [number, number]
}

export interface GroupAxisParams {
  // xLabel: string
  // labelAnchor: 'start' | 'end'
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  ticks: number | null | 'all'
  tickFormat: string | ((text: any) => string)
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

export interface ValueAxisParams {
  // xLabel: string
  // labelAnchor: 'start' | 'end'
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  ticks: number | null
  tickFormat: string | ((text: d3.NumberValue) => string)
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

export interface ValueStackAxisParams extends ValueAxisParams {}

export interface ScalingAreaParams {

}

export interface GridLegendParams {
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