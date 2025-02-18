import type { PresetPartial } from '../../lib/core-types'
import type { PresetRelationshipPluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_FORCE_DIRECTED_BUBBLES_NONE_ARROW: PresetPartial<'relationship', Partial<PresetRelationshipPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_FORCE_DIRECTED_BUBBLES_NONE_ARROW',
  description: 'Force Directed Bubbles沒有箭頭',
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
    // padding: {
    //   top: 40,
    //   right: 40,
    //   bottom: 60,
    //   left: 40
    // },
  },
  allPluginParams: {
    ForceDirectedBubbles: {
      arrow: {
        pointerWidth: 0,
        pointerHeight: 0,
        // strokeWidthMin: 1.5,
        // strokeWidthMax: 9
      }
    },
    RelationshipLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
