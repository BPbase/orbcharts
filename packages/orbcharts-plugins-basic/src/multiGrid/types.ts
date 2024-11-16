import type { BaseBarsParams } from '../base/BaseBars'
import type { BaseBarStackParams } from '../base/BaseBarStack'
import type { BaseBarsTriangleParams } from '../base/BaseBarsTriangle'
import type { BaseLinesParams } from '../base/BaseLines'
import type { BaseLineAreasParams } from '../base/BaseLineAreas'
import type { BaseDotsParams } from '../base/BaseDots'
import type { BaseGroupAxisParams } from '../base/BaseGroupAxis'
import type { BaseValueAxisParams } from '../base/BaseValueAxis'
import type {
  ChartParams, Layout, ColorType } from '../../lib/core-types'

export interface MultiGridLegendParams {
  position: 'top' | 'bottom' | 'left' | 'right'
  justify: 'start' | 'center' | 'end'
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

export interface MultiGroupAxisParams extends BaseGroupAxisParams {
  gridIndexes: number[] | 'all'
}

export interface MultiValueAxisParams extends BaseValueAxisParams {
  gridIndexes: number[] | 'all'
}

export interface MultiValueStackAxisParams extends BaseValueAxisParams {
  gridIndexes: number[] | 'all'
}

export interface MultiBarsParams extends BaseBarsParams {
  gridIndexes: number[] | 'all'
}

export interface MultiBarStackParams extends BaseBarStackParams {
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

export interface OverlappingValueStackAxesParams extends OverlappingValueAxesParams {}