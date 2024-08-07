import type { BarsAndLinesParams, MultiGridLegendParams } from './types'

export const DEFAULT_BARS_AND_LINES_PARAMS: BarsAndLinesParams = {
  bars: {
    barWidth: 0,
    barPadding: 1,
    barGroupPadding: 40,
    barRadius: false,
  },
  lines: {
    lineCurve: 'curveLinear',
    lineWidth: 2
  }
}

export const DEFAULT_MULTI_GRID_LEGEND_PARAMS: MultiGridLegendParams = {
  position: 'right',
  justify: 'end',
  padding: 28,
  backgroundFill: 'none',
  backgroundStroke: 'none',
  gap: 10,
  listRectWidth: 14,
  listRectHeight: 14,
  listRectRadius: 0,
  gridList: [
    {
      listRectWidth: 14,
      listRectHeight: 14,
      listRectRadius: 0,
    }
  ]
}
