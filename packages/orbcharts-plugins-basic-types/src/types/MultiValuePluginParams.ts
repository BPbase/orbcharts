import type { ColorType, EventGrid } from '../../lib/core-types'

export interface ScatterParams {
  radius: number
  fillColorType: ColorType
  strokeColorType: ColorType
  strokeWidth: number
}

export interface MultiValueAxesParams {
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