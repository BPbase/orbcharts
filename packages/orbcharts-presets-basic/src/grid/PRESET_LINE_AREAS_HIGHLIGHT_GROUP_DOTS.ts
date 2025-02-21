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
    highlightTarget: 'group'
  },
  dataFormatter: {
    groupAxis: {
      scalePadding: 0
    }
  },
  allPluginParams: {
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
