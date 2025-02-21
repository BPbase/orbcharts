import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_LINE_AREAS_CURVE: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_LINE_AREAS_CURVE',
  description: 'Curve LineArea',
  descriptionZh: '弧線的折線區域圖',
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
    highlightTarget: 'series'
  },
  dataFormatter: {
    // grid: {
      groupAxis: {
        scalePadding: 0
      }
    // }
  },
  pluginParams: {
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Lines: {
      lineCurve: 'curveMonotoneX',
      lineWidth: 3
    },
    LineAreas: {
      lineCurve: 'curveMonotoneX',
    },
    Dots: {},
    GroupAxis: {},
    ValueAxis: {},
    GroupAux: {},
    GridLegend: {
      // position: 'bottom',
      // justify: 'center',
      placement: 'bottom',
      padding: 14,
      listRectHeight: 2
    }
  }
}
