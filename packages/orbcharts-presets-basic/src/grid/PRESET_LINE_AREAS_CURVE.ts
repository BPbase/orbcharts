import type { PresetPartial } from '@orbcharts/core'
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

export const PRESET_LINE_AREAS_CURVE: PresetPartial<'grid', PresetLinesParams
& PresetLineAreasParams
& PresetDotsParams
& PresetGridLegendParams
& PresetGroupAxisParams
& PresetValueAxisParams
& PresetGroupAuxParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_LINE_AREAS_CURVE',
  description: '弧線折線圖',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
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
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Lines: {
      lineCurve: 'curveMonotoneX',
      lineWidth: 3
    },
    LineAreas: {
      lineCurve: 'curveMonotoneX',
    },
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
