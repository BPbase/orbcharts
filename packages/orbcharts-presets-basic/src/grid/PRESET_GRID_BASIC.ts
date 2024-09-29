import type { PresetPartial } from '@orbcharts/core'
import type { PresetGridPluginParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_GRID, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_GRID_BASIC: PresetPartial<'grid', PresetGridPluginParams & PresetNoneDataPluginParams> = {
  name: 'PRESET_GRID_BASIC',
  description: '基本Grid參數',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 60
    },
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_GRID,
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    GridLegend: {
      position: 'bottom',
      justify: 'center',
      padding: 14,
    }
  }
}
