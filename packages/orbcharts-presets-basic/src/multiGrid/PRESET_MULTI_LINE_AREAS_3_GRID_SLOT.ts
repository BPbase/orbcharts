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

export const PRESET_MULTI_LINE_AREAS_3_GRID_SLOT: PresetPartial<'multiGrid', PresetMultiGroupAxisParams
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
  name: 'PRESET_MULTI_LINE_AREAS_3_GRID_SLOT',
  description: '3組區域圖表',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 160,
      left: 60
    },
  },
  dataFormatter: {
    gridList: [
      {
        // slotIndex: 0
        groupAxis: {
          scalePadding: 0
        }
      },
      {
        // slotIndex: 1,
        groupAxis: {
          scalePadding: 0
        }
      },
      {
        // slotIndex: 2,
        groupAxis: {
          scalePadding: 0
        }
      }
    ],
    separateGrid: true,
    // container: {
    //   rowAmount: 1,
    //   columnAmount: 3,
    // }
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
