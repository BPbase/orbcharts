import type { PresetPartial } from '../../lib/core-types'
import type { PresetRelationshipPluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_FORCE_DIRECTED_NONE_ARROW: PresetPartial<'relationship', Partial<PresetRelationshipPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_FORCE_DIRECTED_NONE_ARROW',
  description: '基本Force Directed參數',
  // chartParams: {
  //   padding: {
  //     top: 40,
  //     right: 40,
  //     bottom: 60,
  //     left: 40
  //   },
  // },
  allPluginParams: {
    ForceDirected: {
      edge: {
        arrowWidth: 0,
        arrowHeight: 0
      }
    },
    RelationshipLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}