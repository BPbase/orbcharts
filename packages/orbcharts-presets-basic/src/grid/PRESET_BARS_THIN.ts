import type { PresetPartial } from '@orbcharts/core'
import type { PresetBarsParams,
  PresetGroupAxisParams,
  PresetValueAxisParams,
  PresetGroupAuxParams,
  PresetGridLegendParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_BARS_THIN: PresetPartial<'grid', PresetBarsParams
& PresetGroupAxisParams
& PresetValueAxisParams
& PresetGroupAuxParams
& PresetGridLegendParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_BARS_THIN',
  description: '細長條圖',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 60
    },
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Bars: {
      barWidth: 20,
      barPadding: 1,
      barGroupPadding: 10
    },
    GroupAxis: {},
    ValueAxis: {},
    GroupAux: {},
    GridLegend: {
      position: 'bottom',
      justify: 'center',
      padding: 14,
    }
  }
}
