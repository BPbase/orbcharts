import type { 
  BaseBarsParams, 
  BaseStackedBarParams, 
  BaseBarsTriangleParams, 
  BaseLinesParams, 
  BaseLineAreasParams, 
  BaseDotsParams, 
  BaseGroupAxisParams,
  BaseValueAxisParams 
} from './BasePluginParams'
import type { ColorType, EventMultiGrid } from '../../lib/core-types'
import type { BaseTooltipStyle, BaseTooltipUtils } from './BasePluginParams'

export interface MultiGridLegendParams {
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
  // 可針對各grid設定，覆蓋全域設定
  gridList: Array<{
    listRectWidth: number
    listRectHeight: number
    listRectRadius: number
  }>
  textColorType: ColorType
}

export interface MultiGridTooltipParams {
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
      eventData: EventMultiGrid,
      context: {
        styles: BaseTooltipStyle
        utils: BaseTooltipUtils
      }
    ) => string[] | string
  )
}

export interface MultiGroupAxisParams extends BaseGroupAxisParams {
  gridIndexes: number[] | 'all'
}

export interface MultiValueAxisParams extends BaseValueAxisParams {
  gridIndexes: number[] | 'all'
}

export interface MultiStackedValueAxisParams extends BaseValueAxisParams {
  gridIndexes: number[] | 'all'
}

export interface MultiBarsParams extends BaseBarsParams {
  gridIndexes: number[] | 'all'
}

export interface MultiStackedBarParams extends BaseStackedBarParams {
  gridIndexes: number[] | 'all'
}

export interface MultiBarsTriangleParams extends BaseBarsTriangleParams {
  gridIndexes: number[] | 'all'
}

export interface MultiLinesParams extends BaseLinesParams {
  gridIndexes: number[] | 'all'
}

export interface MultiLineAreasParams extends BaseLineAreasParams {
  gridIndexes: number[] | 'all'
}

export interface MultiDotsParams extends BaseDotsParams {
  gridIndexes: number[] | 'all'
}

export interface OverlappingValueAxesParams {
  firstAxis: BaseValueAxisParams
  secondAxis: BaseValueAxisParams
  gridIndexes: [number, number]
}

export interface OverlappingStackedValueAxesParams extends OverlappingValueAxesParams {}