import type { TreeMapParams, TreeLegendParams } from './types'

export const DEFAULT_TREE_MAP_PARAMS: TreeMapParams = {
  paddingInner: 2,
  paddingOuter: 2,
  labelColorType: 'primary',
  squarifyRatio: 1.618034, // 黃金比例
  sort: (a, b) => b.value - a.value
}
DEFAULT_TREE_MAP_PARAMS.sort.toString = () => `(a, b) => b.value - a.value`

export const DEFAULT_TREE_LEGEND_PARAMS: TreeLegendParams = {
  position: 'right',
  justify: 'end',
  padding: 28,
  backgroundFill: 'none',
  backgroundStroke: 'none',
  gap: 10,
  listRectWidth: 14,
  listRectHeight: 14,
  listRectRadius: 0,
  textColorType: 'primary'
}
