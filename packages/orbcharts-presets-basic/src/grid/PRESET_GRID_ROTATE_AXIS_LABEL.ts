import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_GRID_ROTATE_AXIS_LABEL: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_GRID_ROTATE_AXIS_LABEL',
  description: 'Rotate axis label',
  descriptionZh: '傾斜標籤',
  chartParams: {
    colors: {
      light: {
        label: [
          "#0088FF",
          "#FF72BB",
          "#16B59B",
          "#F9B052",
          "#6F3BD5",
          "#42C724",
          "#FF3232",
          "#904026",
          "#1F3172",
          "#E23D93"
        ],
      },
      dark: {
        label: [
          "#4BABFF",
          "#FFA0A0",
          "#7DD3C4",
          "#FAC77D",
          "#8454D4",
          "#42C724",
          "#FF6C6C",
          "#D4785A",
          "#5366AC",
          "#FF8DC8"
        ]
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
    GroupAux: {
      labelRotate: -30
    },
    GroupAxis: {
      tickPadding: 15,
      tickTextRotate: -30
    },
    GridLegend: {
      placement: 'bottom',
      padding: 14,
    }
  }
}
