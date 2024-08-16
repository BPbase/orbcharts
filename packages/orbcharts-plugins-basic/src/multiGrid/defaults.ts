import type {
  MultiGridLegendParams,
  MultiGridBarsParams,
  MultiGridBarStackParams,
  MultiGridBarsTriangleParams,
  MultiGridLinesParams,
} from './types'

// export const DEFAULT_BARS_AND_LINES_PARAMS: BarsAndLinesParams = {
//   bars: {
//     barWidth: 0,
//     barPadding: 1,
//     barGroupPadding: 40,
//     barRadius: false,
//   },
//   lines: {
//     lineCurve: 'curveLinear',
//     lineWidth: 2
//   }
// }

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

export const DEFAULT_MULTI_GRID_BARS_PARAMS: MultiGridBarsParams = {
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 40,
  barRadius: false,
  gridIndex: 0
}

export const DEFAULT_MULTI_GRID_BAR_STACK_PARAMS: MultiGridBarStackParams = {
  barWidth: 0,
  barGroupPadding: 10,
  barRadius: false,
  gridIndex: 0
}

export const DEFAULT_MULTI_GRID_BARS_TRIANGLE_PARAMS: MultiGridBarsTriangleParams = {
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 20,
  linearGradientOpacity: [1, 0],
  gridIndex: 0
}

export const DEFAULT_MULTI_GRID_LINES_PARAMS: MultiGridLinesParams = {
  lineCurve: 'curveLinear',
  lineWidth: 2,
  gridIndex: 1
}