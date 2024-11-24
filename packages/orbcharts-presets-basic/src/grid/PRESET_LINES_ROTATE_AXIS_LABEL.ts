import type { PresetPartial } from '../../lib/core-types'
import type { PresetLinesParams,
  PresetDotsParams,
  PresetGroupAxisParams,
  PresetValueAxisParams,
  PresetGroupAuxParams,
  PresetGridLegendParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_LINES_ROTATE_AXIS_LABEL: PresetPartial<'grid', PresetLinesParams
& PresetDotsParams
& PresetGridLegendParams
& PresetGroupAxisParams
& PresetValueAxisParams
& PresetGroupAuxParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_LINES_ROTATE_AXIS_LABEL',
  description: '傾斜標籤',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 160,
      left: 60
    },
    highlightTarget: 'series'
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Lines: {},
    Dots: {},
    GroupAxis: {
      tickPadding: 15,
      tickTextRotate: -30
    },
    ValueAxis: {},
    GroupAux: {
      labelRotate: -30
    },
    GridLegend: {
      position: 'bottom',
      justify: 'center',
      padding: 14,
      listRectHeight: 2
    }
  }
}
