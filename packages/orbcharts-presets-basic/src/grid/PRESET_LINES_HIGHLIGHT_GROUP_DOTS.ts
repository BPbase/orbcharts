import type { PresetPartial } from '@orbcharts/core'
import type { PresetLinesParams,
  PresetDotsParams,
  PresetGroupAxisParams,
  PresetValueAxisParams,
  PresetGroupAuxParams,
  PresetGridLegendParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_LINES_HIGHLIGHT_GROUP_DOTS: PresetPartial<'grid', PresetLinesParams
& PresetDotsParams
& PresetGridLegendParams
& PresetGroupAxisParams
& PresetValueAxisParams
& PresetGroupAuxParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_LINES_HIGHLIGHT_GROUP_DOTS',
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
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Lines: {},
    Dots: {
      onlyShowHighlighted: false
    },
    GroupAxis: {},
    ValueAxis: {},
    GroupAux: {},
    GridLegend: {
      position: 'bottom',
      justify: 'center',
      padding: 14,
      listRectHeight: 2
    }
  }
}
