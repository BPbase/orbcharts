import type { PresetPartial } from '@orbcharts/core'
import type { 
  PresetMultiGridLegendParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_MULTI_GRID, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_MULTI_GRID_BASIC: PresetPartial<'multiGrid', PresetMultiGridLegendParams & PresetNoneDataPluginParams> = {
  name: 'PRESET_MULTI_GRID_BASIC',
  description: '基本MultiGrid參數',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 60
    },
    highlightTarget: 'series'
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_MULTI_GRID,
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    MultiGridLegend: {
      position: 'bottom',
      justify: 'center',
      padding: 14,
      gridList: [
        {
        },
        {
          listRectHeight: 2,
        }
      ]
    }
  }
}
