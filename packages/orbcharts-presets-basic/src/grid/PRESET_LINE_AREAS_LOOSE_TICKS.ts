import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

export const PRESET_LINE_AREAS_LOOSE_TICKS: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_LINE_AREAS_LOOSE_TICKS',
  description: 'Loose Ticks LineArea',
  descriptionZh: '寬鬆標籤的折線區域圖',
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
    groupAxis: {
      scalePadding: 0
    }
  },
  allPluginParams: {
    Lines: {},
    LineAreas: {},
    Dots: {},
    GroupAxis: {
      ticks: 6
    },
    ValueAxis: {},
    GroupAux: {},
    GridLegend: {
      placement: 'bottom',
      padding: 14,
      listRectHeight: 2
    }
  }
}
