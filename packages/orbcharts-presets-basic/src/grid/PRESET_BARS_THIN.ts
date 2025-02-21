import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_BARS_THIN: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_BARS_THIN',
  description: 'Thin bars',
  descriptionZh: '細長條圖',
  chartParams: {
    colors: {
      light: {
        label: [
          "#4BABFF",
          "#FFA0A0",
          "#7DD3C4",
          "#F9B052",
          "#8454D4",
          "#42C724",
          "#FF4B4B",
          "#904026",
          "#4B25B3",
          "#C50669"
        ],
      }
    },
    padding: {
      top: 40,
      right: 40,
      bottom: 100,
      left: 80
    },
  },
  pluginParams: {
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
