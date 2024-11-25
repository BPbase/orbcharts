import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_GRID, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_GRID_SEPARATE_SERIES: PresetPartial<'grid', PresetGridPluginParams & PresetNoneDataPluginParams> = {
  name: 'PRESET_GRID_SEPARATE_SERIES',
  description: '分開顯示Series',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 160,
      left: 60
    },
  },
  dataFormatter: {
    grid: {
      // seriesSlotIndexes: [0, 1],
      separateSeries: true,
    },
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_GRID,
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    GroupAux: {
      labelRotate: -30
    },
    GroupAxis: {
      tickPadding: 15,
      tickTextRotate: -30
    },
    GridLegend: {
      // position: 'bottom',
      // justify: 'center',
      placement: 'bottom',
      padding: 14,
    }
  }
}
