import type { ColorType, EventMultiValue } from '../../lib/core-types'
import type { BaseTooltipStyle, BaseTooltipUtils } from './BasePluginParams'
import type { ArcScaleType, Placement } from './Common'

export interface MultiValueLegendParams {
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

export interface MultiValueTooltipParams {
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
      eventData: EventMultiValue,
      context: {
        styles: BaseTooltipStyle
        utils: BaseTooltipUtils
      }
    ) => string[] | string
  )
}

export interface OrdinalAxisParams {

}

export interface OrdinalZoomParams {

}

export interface RankingAxisParams {
  
}

export interface RankingBarsParams {

}

export interface RankingBubblesParams {

}

export interface RankingTextParams {

}

export interface ScatterParams {
  radius: number
  fillColorType: ColorType
  strokeColorType: ColorType
  strokeWidth: number
}

export interface ScatterBubblesParams {
  // radius: number
  fillColorType: ColorType
  strokeColorType: ColorType
  strokeWidth: number
  valueLinearOpacity: [number, number]
  arcScaleType: ArcScaleType
  sizeAdjust: number
}

export interface XAxisParams {
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

export interface XYAuxParams {
  xAxis: {
    showLine: boolean
    showLabel: boolean
    lineDashArray: string
    lineColorType: ColorType
    labelColorType: ColorType
    labelTextColorType: ColorType
    labelTextFormat: string | ((text: any) => string)
    labelPadding: number
    // labelRotate: number
  }
  yAxis: {
    showLine: boolean
    showLabel: boolean
    lineDashArray: string
    lineColorType: ColorType
    labelColorType: ColorType
    labelTextColorType: ColorType
    labelTextFormat: string | ((text: any) => string)
    labelPadding: number
    // labelRotate: number
  }
}

export interface XYAxesParams {
  xAxis: {
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
  yAxis: {
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
}


export interface XZoomParams {

}

export interface YAxisParams {
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