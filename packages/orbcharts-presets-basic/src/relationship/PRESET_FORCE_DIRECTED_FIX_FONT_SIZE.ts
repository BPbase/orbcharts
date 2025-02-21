import type { PresetPartial } from '../../lib/core-types'
import type { PresetRelationshipPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_FORCE_DIRECTED_FIX_FONT_SIZE: PresetPartial<'relationship', Partial<PresetRelationshipPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_FORCE_DIRECTED_FIX_FONT_SIZE',
  description: 'Force Directed Chart with fixed font size',
  descriptionZh: '固定字體大小的力導向圖',
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
  },
  allPluginParams: {
    ForceDirected: {
      dotLabel: {
        sizeFixed: true
      },
      arrowLabel: {
        sizeFixed: true
      }
    },
    RelationshipLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
