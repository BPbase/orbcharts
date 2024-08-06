import type { BarsAndLinesParams } from './types'

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
