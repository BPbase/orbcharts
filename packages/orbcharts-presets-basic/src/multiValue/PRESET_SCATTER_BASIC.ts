import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_GRID, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_SCATTER_BASIC: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_SCATTER_BASIC',
  description: '基本散布圖',
  chartParams: {
    colors: {
      light: {
        label:  [
          "#16B59B",
          "#0088FF",
          "#FF3232",
          "#8E6BC9",
          "#904026",
          "#D117EA",
          "#F38428",
          "#6BDC51",
          "#C50669",
          "#4B25B3"
        ],
      }
    },
    padding: {
      top: 60,
      right: 60,
      bottom: 100,
      left: 60
    },
  },
  allPluginParams: {
    MultiValueLegend: {
      placement: 'bottom',
      padding: 14,
    }
  }
}
