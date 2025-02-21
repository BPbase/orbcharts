import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

export const PRESET_LINES_SIMPLE: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_LINES_SIMPLE',
  description: 'Simple line',
  descriptionZh: '簡單折線圖',
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
      bottom: 80,
      left: 40
    },
    highlightTarget: 'series'
  },
  dataFormatter: {
    valueAxis: {
      scaleRange: [0, 0.95]
    }
  },
  pluginParams: {
    Lines: {},
    Dots: {},
    GroupAxis: {},
    ValueAxis: {},
    GroupAux: {},
    GridLegend: {
      placement: 'bottom',
      padding: 7,
      listRectHeight: 2
    }
  }
}
