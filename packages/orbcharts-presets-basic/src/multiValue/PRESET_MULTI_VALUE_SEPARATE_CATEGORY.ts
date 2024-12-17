import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_GRID, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_MULTI_VALUE_SEPARATE_CATEGORY: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_MULTI_VALUE_SEPARATE_CATEGORY',
  description: 'MultiValue 分開顯示category',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 60
    },
  },
  dataFormatter: {
    separateCategory: true
  },
  allPluginParams: {
    MultiValueLegend: {
      placement: 'bottom',
      padding: 14,
    }
  }
}
