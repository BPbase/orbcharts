import type { BaseBarsParams } from '../base/BaseBars'
import type { BaseLinesParams } from '../base/BaseLines'
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
