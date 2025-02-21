import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_GRID, ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_GRID_ROTATE_AXIS_LABEL: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_GRID_ROTATE_AXIS_LABEL',
  description: 'Rotate axis label',
  descriptionZh: '傾斜標籤',
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
    // 間距下面加長留空
    padding: {
      top: 40,
      right: 40,
      bottom: 140,
      left: 80
    },
  },
  pluginParams: {
    // ...ALL_PLUGIN_PARAMS_GRID,
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    GroupAux: {
      labelRotate: -30
    },
    GroupAxis: {
      tickPadding: 15,
      tickTextRotate: -30
    },
    GridLegend: {
      // position: 'bottom',
      // justify: 'center',
      placement: 'bottom',
      padding: 14,
    }
  }
}
