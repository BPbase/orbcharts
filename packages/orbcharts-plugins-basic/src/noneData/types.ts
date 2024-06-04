import type { ColorType, ChartType, EventTypeMap, EventBase } from '@orbcharts/core'

export interface ContainerPluginParams {
  header: {
    height: number
    text: string[]
    textStyle: string[]
  }
  footer: {
    height: number
    text: string[]
    textStyle: string[]
  }
}

export type TooltipParams = {
  backgroundColorType: ColorType
  backgroundOpacity: number
  strokeColorType: ColorType
  textColorType: ColorType
  offset: [number, number]
  padding: number
  textRenderFn: <T extends ChartType> (eventData: EventTypeMap<T>) => string[]
  svgRenderFn: (<T extends ChartType> (eventData: EventTypeMap<T>) => string) | null
}

