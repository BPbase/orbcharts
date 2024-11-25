import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_GRID, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_GRID_ROTATE_AXIS_LABEL: PresetPartial<'grid', PresetGridPluginParams & PresetNoneDataPluginParams> = {
  name: 'PRESET_GRID_ROTATE_AXIS_LABEL',
  description: '傾斜標籤',
  chartParams: {
    // 間距下面加長留空
    padding: {
      top: 60,
      right: 60,
      bottom: 160,
      left: 60
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
