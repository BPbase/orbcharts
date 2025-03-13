import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

export const PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS',
  description: 'Highlight Group Dots LineArea',
  descriptionZh: 'Highlight Group圓點的折線區域圖',
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
    padding: {
      top: 40,
      right: 60, // lineAre 的左右刻度靠邊，要避免太窄造成 label 超出
      bottom: 100,
      left: 60
    },
    highlightTarget: 'group'
  },
  dataFormatter: {
    groupAxis: {
      scalePadding: 0
    }
  },
  pluginParams: {
    Lines: {
      lineWidth: 3
    },
    LineAreas: {},
    Dots: {
      onlyShowHighlighted: false
    },
    GroupAxis: {},
    ValueAxis: {},
    GroupAux: {},
    GridLegend: {
      placement: 'bottom',
      padding: 14,
      listRectHeight: 2
    }
  }
}
