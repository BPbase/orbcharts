import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_GRID, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_GRID_PN_SCALE: PresetPartial<'grid', PresetGridPluginParams & PresetNoneDataPluginParams> = {
  name: 'PRESET_GRID_PN_SCALE',
  description: '正負值分向圖',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 60
    },
  },
  dataFormatter: {
    grid: {
      valueAxis: {
        scaleDomain: ['auto', 'auto'],
        scaleRange: [0.05, 0.95],
      },
    }
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_GRID,
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    GridLegend: {
      // position: 'bottom',
      // justify: 'center',
      placement: 'bottom',
      padding: 14,
    }
  }
}
