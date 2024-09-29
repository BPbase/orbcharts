import type { PresetPartial } from '@orbcharts/core'
import type { 
  PresetMultiGroupAxisParams,
  PresetMultiValueAxisParams,
  PresetMultiValueStackAxisParams,
  PresetMultiBarsParams,
  PresetMultiBarStackParams,
  PresetMultiBarsTriangleParams,
  PresetMultiLinesParams,
  PresetMultiLineAreasParams,
  PresetMultiDotsParams,
  PresetMultiGridLegendParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_MULTI_LINES_2_GRID_SLOT: PresetPartial<'multiGrid', PresetMultiGroupAxisParams
& PresetMultiValueAxisParams
& PresetMultiValueStackAxisParams
& PresetMultiBarsParams
& PresetMultiBarStackParams
& PresetMultiBarsTriangleParams
& PresetMultiLinesParams
& PresetMultiLineAreasParams
& PresetMultiDotsParams
& PresetMultiGridLegendParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_MULTI_LINES_2_GRID_SLOT',
  description: '2組折線圖表',
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
      gridIndexes: [0, 1]
    },
    MultiValueAxis: {
      gridIndexes: [0, 1]
    },
    MultiValueStackAxis: {
      gridIndexes: [0, 1]
    },
    MultiBars: {
      gridIndexes: [0, 1]
    },
    MultiBarStack: {
      gridIndexes: [0, 1]
    },
    MultiBarsTriangle: {
      gridIndexes: [0, 1]
    },
    MultiLines: {
      gridIndexes: [0, 1]
    },
    MultiLineAreas: {
      gridIndexes: [0, 1]
    },
    MultiDots: {
      gridIndexes: [0, 1]
    },
    MultiGridLegend: {
      position: 'bottom',
      justify: 'center',
      padding: 14,
      gridList: [
        {
          listRectHeight: 2,
        },
        {
          listRectHeight: 2,
        },
        {
          listRectHeight: 2,
        },
        {
          listRectHeight: 2,
        }
      ]
    }
  }
}
