import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_BARS_HORIZONTAL_AND_THIN: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
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
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Bars: {
      barWidth: 20,
      barPadding: 1,
      barGroupPadding: 10
    },
    GroupAxis: {},
    ValueAxis: {},
    GroupAux: {},
    GridLegend: {
      // position: 'bottom',
      // justify: 'center',
      placement: 'bottom',
      padding: 14,
    }
  }
}
