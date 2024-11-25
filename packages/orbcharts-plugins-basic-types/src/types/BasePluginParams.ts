import type { ColorType } from '../../lib/core-types'

export interface BaseBarsParams {
  // barType: BarType
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  barRadius: number | boolean
}

export interface BaseBarStackParams {
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

export interface BaseLegendParams {
  position: 'top' | 'bottom' | 'left' | 'right'
  justify: 'start' | 'center' | 'end'
  padding: number
  // offset: [number, number]
  backgroundFill: ColorType
  backgroundStroke: ColorType
  textColorType: ColorType
  gap: number
  seriesList: Array<{
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

export interface BaseValueAxisParams {
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  ticks: number
  tickFormat: string | ((text: d3.NumberValue) => string)
  tickLineVisible: boolean
  tickPadding: number
  tickFullLine: boolean
  tickFullLineDasharray: string
  tickColorType: ColorType
  tickTextRotate: number
  tickTextColorType: ColorType
}
