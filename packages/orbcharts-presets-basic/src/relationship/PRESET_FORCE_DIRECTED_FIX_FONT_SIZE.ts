import type { PresetPartial } from '../../lib/core-types'
import type { PresetRelationshipPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_FORCE_DIRECTED_FIX_FONT_SIZE: PresetPartial<'relationship', Partial<PresetRelationshipPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_FORCE_DIRECTED_FIX_FONT_SIZE',
  description: 'Force directed chart with fixed font size',
  descriptionZh: '固定字體大小的力導向圖',
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
  },
  pluginParams: {
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
