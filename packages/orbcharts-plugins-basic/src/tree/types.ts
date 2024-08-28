import type { ColorType, ComputedDataTree } from '@orbcharts/core'

export interface TreeMapParams {
  paddingInner: number
  paddingOuter: number
  labelColorType: ColorType
  squarifyRatio: number
  sort: (a: ComputedDataTree, b: ComputedDataTree) => number
}

export interface TreeLegendParams {
  position: 'top' | 'bottom' | 'left' | 'right'
  justify: 'start' | 'center' | 'end'
  padding: number
  backgroundFill: ColorType
  backgroundStroke: ColorType
  gap: number
  listRectWidth: number
  listRectHeight: number
  listRectRadius: number
}

