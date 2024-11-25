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

export const PRESET_LINE_AREAS_SEPARATE_SERIES: PresetPartial<'grid', PresetLinesParams
& PresetLineAreasParams
& PresetDotsParams
& PresetGridLegendParams
& PresetGroupAxisParams
& PresetValueAxisParams
& PresetGroupAuxParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_LINE_AREAS_SEPARATE_SERIES',
  description: 'LineAreas 分開顯示Series',
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
      // seriesSlotIndexes: [0, 1],
      separateSeries: true,
      groupAxis: {
        scalePadding: 0
      }
    },
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
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
