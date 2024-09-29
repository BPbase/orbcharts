import type { PresetPartial } from '@orbcharts/core'
import type { PresetBarsParams,
  PresetGroupAxisParams,
  PresetValueAxisParams,
  PresetGroupAuxParams,
  PresetGridLegendParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_BARS_HORIZONTAL_AND_ROUND: PresetPartial<'grid', PresetBarsParams
& PresetGroupAxisParams
& PresetValueAxisParams
& PresetGroupAuxParams
& PresetGridLegendParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_BARS_HORIZONTAL_AND_ROUND',
  description: '橫向圓角長條圖',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 160
    },
  },
  dataFormatter: {
    grid: {
      valueAxis: {
        position: 'bottom'
        // position: 'top'
        // position: 'left'
        // position: 'right'
      },
      groupAxis: {
        position: 'left'
        // position: 'right'
        // position: 'bottom'
        // position: 'top'
      },
    }
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
