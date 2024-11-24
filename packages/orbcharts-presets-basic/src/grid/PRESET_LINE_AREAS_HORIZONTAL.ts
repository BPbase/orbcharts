import type { PresetPartial } from '../../lib/core-types'
import type { PresetLinesParams,
  PresetLineAreasParams,
  PresetDotsParams,
  PresetGroupAxisParams,
  PresetValueAxisParams,
  PresetGroupAuxParams,
  PresetGridLegendParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_LINE_AREAS_HORIZONTAL: PresetPartial<'grid', PresetLinesParams
& PresetLineAreasParams
& PresetDotsParams
& PresetGridLegendParams
& PresetGroupAxisParams
& PresetValueAxisParams
& PresetGroupAuxParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_LINE_AREAS_HORIZONTAL',
  description: '橫向折線圖',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 160
    },
    highlightTarget: 'series'
  },
  dataFormatter: {
    grid: {
      valueAxis: {
        position: 'bottom'
      },
      groupAxis: {
        position: 'left',
        scalePadding: 0
      },
    }
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Lines: {},
    LineAreas: {},
    Dots: {},
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
