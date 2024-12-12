import type { ColorType, EventMultiValue } from '../../lib/core-types'
import type { BaseTooltipStyle, BaseTooltipUtils } from './BasePluginParams'
import type { ArcScaleType } from './Common'

export interface MultiValueLegendParams {
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
    tickFormat: string | ((text: d3.NumberValue) => string)
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
    tickFormat: string | ((text: d3.NumberValue) => string)
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


export interface XYZoomParams {

}