import type { PresetPartial } from '@orbcharts/core'
import type { PresetBarsParams,
  PresetGroupAxisParams,
  PresetValueAxisParams,
  PresetGroupAuxParams,
  PresetGridLegendParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_BARS_HORIZONTAL_AND_THIN: PresetPartial<'grid', PresetBarsParams
& PresetGroupAxisParams
& PresetValueAxisParams
& PresetGroupAuxParams
& PresetGridLegendParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_BARS_HORIZONTAL_AND_THIN',
  description: '橫向細長長條圖',
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
