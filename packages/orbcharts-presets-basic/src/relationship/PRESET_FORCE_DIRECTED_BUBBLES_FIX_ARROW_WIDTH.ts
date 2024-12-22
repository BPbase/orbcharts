import type { PresetPartial } from '../../lib/core-types'
import type { PresetRelationshipPluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_FORCE_DIRECTED_BUBBLES_FIX_ARROW_WIDTH: PresetPartial<'relationship', Partial<PresetRelationshipPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_FORCE_DIRECTED_BUBBLES_FIX_ARROW_WIDTH',
  description: 'Force Directed Bubbles固定箭頭寬度',
  // chartParams: {
  //   padding: {
  //     top: 40,
  //     right: 40,
  //     bottom: 60,
  //     left: 40
  //   },
  // },
  allPluginParams: {
    ForceDirectedBubbles: {
      arrow: {
        strokeWidthMin: 1.5,
        strokeWidthMax: 1.5
      }
    },
    RelationshipLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
