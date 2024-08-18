import type { BaseBarsParams } from '../base/BaseBars'
import type { BaseBarStackParams } from '../base/BaseBarStack'
import type { BaseBarsTriangleParams } from '../base/BaseBarsTriangle'
import type { BaseLinesParams } from '../base/BaseLines'
import type { BaseDotsParams } from '../base/BaseDots'
import type { BaseGroupAxisParams } from '../base/BaseGroupAxis'
import type { BaseValueAxisParams } from '../base/BaseValueAxis'
import type {
  ChartParams, Layout, ColorType } from '@orbcharts/core'

export interface BarsAndLinesParams {
  bars: BaseBarsParams
  lines: BaseLinesParams
}

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
}

export interface MultiGridGroupAxis extends BaseGroupAxisParams {
  // gridIndex: number
  gridIndexes: number[]
}

export interface MultiGridValueAxis extends BaseValueAxisParams {
  // gridIndex: number
  gridIndexes: number[]
}

export interface MultiGridBarsParams extends BaseBarsParams {
  // gridIndex: number
  gridIndexes: number[]
}

export interface MultiGridBarStackParams extends BaseBarStackParams {
  // gridIndex: number
  gridIndexes: number[]
}

export interface MultiGridBarsTriangleParams extends BaseBarsTriangleParams {
  // gridIndex: number
  gridIndexes: number[]
}

export interface MultiGridLinesParams extends BaseLinesParams {
  // gridIndex: number
  gridIndexes: number[]
}

export interface MultiGridDotsParams extends BaseDotsParams {
  // gridIndex: number
  gridIndexes: number[]
}