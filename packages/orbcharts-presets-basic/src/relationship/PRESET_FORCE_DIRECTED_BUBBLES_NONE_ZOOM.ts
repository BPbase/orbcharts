import type { PresetPartial } from '../../lib/core-types'
import type { PresetRelationshipPluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_FORCE_DIRECTED_BUBBLES_NONE_ZOOM: PresetPartial<'relationship', Partial<PresetRelationshipPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_FORCE_DIRECTED_BUBBLES_NONE_ZOOM',
  description: 'Force Directed Bubbles無滑鼠托曳及縮放控制',
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
      zoomable: false,
    },
    RelationshipLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
