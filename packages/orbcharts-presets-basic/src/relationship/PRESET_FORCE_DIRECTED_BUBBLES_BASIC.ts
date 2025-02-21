import type { PresetPartial } from '../../lib/core-types'
import type { PresetRelationshipPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_FORCE_DIRECTED_BUBBLES_BASIC: PresetPartial<'relationship', Partial<PresetRelationshipPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_FORCE_DIRECTED_BUBBLES_BASIC',
  description: 'Basic Force Directed Bubbles Chart',
  descriptionZh: '基本力導向泡泡圖',
  chartParams: {
    colors: {
      light: {
        label: [
          "#6CBAFF",
          "#FF6C6C",
          "#F9B052",
          "#7DD3C4",
          "#AA93D2",
          "#0088FF",
          "#FFBABA",
          "#86DC72",
          "#EF76FF",
          "#C4C4C4"
        ],
      }
    }
  },
  allPluginParams: {
    ForceDirectedBubbles: {},
    RelationshipLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
