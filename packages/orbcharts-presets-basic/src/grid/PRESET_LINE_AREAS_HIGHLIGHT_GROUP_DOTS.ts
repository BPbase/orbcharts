import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS',
  description: '折線圖及Highlight Group圓點',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 60
    },
    highlightTarget: 'group'
  },
  dataFormatter: {
    grid: {
      groupAxis: {
        scalePadding: 0
      }
    }
  },
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
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
      // position: 'bottom',
      // justify: 'center',
      placement: 'bottom',
      padding: 14,
      listRectHeight: 2
    }
  }
}
