import type { PresetPartial } from '@orbcharts/core'
import type { PresetTreeLegendParams, PresetTreeMapParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_TREE_BASIC: PresetPartial<'tree', PresetTreeLegendParams & PresetTreeMapParams & PresetNoneDataPluginParams> = {
  name: 'PRESET_TREE_BASIC',
  description: '基本Tree參數',
  chartParams: {
    padding: {
      top: 40,
      right: 40,
      bottom: 60,
      left: 40
    },
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    TreeMap: {},
    TreeLegend: {
      position: 'bottom',
      justify: 'center',
      padding: 14,
    }
  }
}
