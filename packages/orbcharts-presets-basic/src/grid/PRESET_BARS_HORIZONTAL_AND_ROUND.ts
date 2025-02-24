import type { PresetPartial } from '../../lib/core-types'
import type { PresetBarsParams,
  PresetGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

export const PRESET_BARS_HORIZONTAL_AND_ROUND: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_BARS_HORIZONTAL_AND_ROUND',
  description: 'Horizontal bars with round corners',
  descriptionZh: '橫向圓角長條圖',
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
      right: 40,
      bottom: 100,
      left: 160
    },
  },
  dataFormatter: {
    valueAxis: {
      position: 'bottom'
    },
    groupAxis: {
      position: 'left'
    },
  },
  pluginParams: {
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
      placement: 'bottom',
      padding: 14,
      listRectRadius: 7,
    }
  }
}
