import type { ColorType, ChartType, EventTypeMap, EventBase } from '../../lib/core-types'

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
  textRenderFn: (<T extends ChartType>(eventData: EventTypeMap<T>) => string[] | string) | null
  svgRenderFn: (<T extends ChartType>(eventData: EventTypeMap<T>) => string) | null
}

