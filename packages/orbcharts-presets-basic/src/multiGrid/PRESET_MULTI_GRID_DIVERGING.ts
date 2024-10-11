import type { PresetPartial } from '@orbcharts/core'
import type { 
  PresetMultiGridSepratedPluginParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_MULTI_GRID_DIVERGING: PresetPartial<'multiGrid', PresetMultiGridSepratedPluginParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_MULTI_GRID_DIVERGING',
  description: '雙向折線圖',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 60
    },
  },
  dataFormatter: {
    gridList: [
      // 第一個grid
      {
        groupAxis: {
          position: 'right'
        },
        valueAxis: {
          position: 'bottom'
        },
      },
      // 第二個grid
      {
        groupAxis: {
          position: 'left'
        },
        valueAxis: {
          position: 'bottom'
        },
      }
    ],
    // 設定排版方式
    container: {
      gap: 200,
      rowAmount: 1,
      columnAmount: 2
    },
    separateGrid: true // 將兩個grid拆分
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    MultiGroupAxis: {
      tickPadding: 60, // 加長間距
      gridIndexes: [0] // 只顯示一個
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
    }
  }
}
