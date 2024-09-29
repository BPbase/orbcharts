import type { PresetPartial } from '@orbcharts/core'
import type { 
  PresetMultiGridSepratedPluginParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_MULTI_GRID_3_GRID_SLOT: PresetPartial<'multiGrid', PresetMultiGridSepratedPluginParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_MULTI_GRID_3_GRID_SLOT',
  description: '3組Grid圖表',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 160,
      left: 60
    },
  },
  dataFormatter: {
    separateGrid: true,
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    MultiGroupAxis: {
      tickTextRotate: -30,
      gridIndexes: [0, 1, 2]
    },
    MultiValueAxis: {
      gridIndexes: [0, 1, 2]
    },
    MultiValueStackAxis: {
      gridIndexes: [0, 1, 2]
    },
    MultiBars: {
      gridIndexes: [0, 1, 2]
    },
    MultiBarStack: {
      gridIndexes: [0, 1, 2]
    },
    MultiBarsTriangle: {
      gridIndexes: [0, 1, 2]
    },
    MultiLines: {
      gridIndexes: [0, 1, 2]
    },
    MultiLineAreas: {
      gridIndexes: [0, 1, 2]
    },
    MultiDots: {
      gridIndexes: [0, 1, 2]
    },
    MultiGridLegend: {
      position: 'bottom',
      justify: 'center',
      padding: 14,
    }
  }
}
