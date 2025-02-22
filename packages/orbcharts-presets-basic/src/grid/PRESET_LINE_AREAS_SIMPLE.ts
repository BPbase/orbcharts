import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

export const PRESET_LINE_AREAS_SIMPLE: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_LINE_AREAS_SIMPLE',
  description: 'Simple LineArea',
  descriptionZh: '簡單折線區域圖',
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
      right: 80, // lineAre 的左右刻度靠邊，要避免太窄造成 label 超出
      bottom: 80,
      left: 80 // lineAre 的左右刻度靠邊，要避免太窄造成 label 超出
    },
    highlightTarget: 'series'
  },
  dataFormatter: {
    groupAxis: {
      scalePadding: 0
    },
    valueAxis: {
      scaleRange: [0, 0.95]
    }
  },
  pluginParams: {
    Lines: {},
    LineAreas: {},
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
