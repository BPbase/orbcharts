import type { PresetPartial } from '../../lib/core-types'
import type { PresetBarsParams,
  PresetGroupAxisParams,
  PresetValueAxisParams,
  PresetGroupAuxParams,
  PresetGridLegendParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_BARS_ROUND: PresetPartial<'grid', PresetBarsParams
& PresetGroupAxisParams
& PresetValueAxisParams
& PresetGroupAuxParams
& PresetGridLegendParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_BARS_ROUND',
  description: '圓角長條圖',
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
      barWidth: 0,
      barPadding: 1,
      barGroupPadding: 10,
      barRadius: true,
    },
    GroupAxis: {},
    ValueAxis: {},
    GroupAux: {},
    GridLegend: {
      // 底部圖例及圓弧列點
      position: 'bottom',
      justify: 'center',
      padding: 14,
      listRectRadius: 7,
    }
  }
}
