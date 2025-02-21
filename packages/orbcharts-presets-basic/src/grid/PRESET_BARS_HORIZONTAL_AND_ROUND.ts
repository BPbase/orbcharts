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
  allPluginParams: {
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
