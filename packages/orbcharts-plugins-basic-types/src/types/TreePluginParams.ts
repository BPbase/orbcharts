import type { ColorType, ComputedDataTree } from '../../lib/core-types'

export interface TreeMapParams {
  paddingInner: number
  paddingOuter: number
  labelColorType: ColorType
  squarifyRatio: number
  sort: (a: ComputedDataTree, b: ComputedDataTree) => number
}

export interface TreeLegendParams {
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

