import type { PresetPartial } from '../../lib/core-types'
import type { PresetTreePluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_TREE_MAP_BASIC: PresetPartial<'tree', Partial<PresetTreePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_TREE_MAP_BASIC',
  description: '基本Tree Map參數',
  chartParams: {
    padding: {
      top: 40,
      right: 40,
      bottom: 60,
      left: 40
    },
  },
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    TreeMap: {},
    TreeLegend: {
      // position: 'bottom',
      // justify: 'center',
      placement: 'bottom',
      padding: 14,
    }
  }
}
