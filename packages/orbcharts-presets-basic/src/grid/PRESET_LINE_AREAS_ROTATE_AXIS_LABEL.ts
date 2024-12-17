import type { PresetPartial } from '../../lib/core-types'
import type { PresetGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_LINE_AREAS_ROTATE_AXIS_LABEL: PresetPartial<'grid', Partial<PresetGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_LINE_AREAS_ROTATE_AXIS_LABEL',
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
  dataFormatter: {
    grid: {
      groupAxis: {
        scalePadding: 0
      }
    }
  },
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Lines: {},
    LineAreas: {},
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
      // position: 'bottom',
      // justify: 'center',
      placement: 'bottom',
      padding: 14,
      listRectHeight: 2
    }
  }
}