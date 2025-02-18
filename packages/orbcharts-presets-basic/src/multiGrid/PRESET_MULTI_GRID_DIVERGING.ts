import type { PresetPartial } from '../../lib/core-types'
import type { 
  PresetMultiGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_MULTI_GRID_DIVERGING: PresetPartial<'multiGrid', Partial<PresetMultiGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_MULTI_GRID_DIVERGING',
  description: '雙向折線圖',
  chartParams: {
    colors: {
      light: {
        label:  [
          "#4BABFF",
          "#94D6CB",
          "#F9B052",
          "#8454D4",
          "#D58C75",
          "#42C724",
          "#FF8B8B",
          "#904026",
          "#C50669",
          "#4B25B3"
        ],
      }
    },
    padding: {
      top: 60,
      right: 60,
      bottom: 100,
      left: 80
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
      gap: 160,
      rowAmount: 1,
      columnAmount: 2
    },
    separateGrid: true // 將兩個grid拆分
  },
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    MultiGroupAxis: {
      // tickPadding: 60, // 加長間距
      gridIndexes: [0] // 只顯示一個
    },
    MultiValueAxis: {
      gridIndexes: [0, 1]
    },
    MultiStackedValueAxis: {
      gridIndexes: [0, 1]
    },
    MultiBars: {
      gridIndexes: [0, 1]
    },
    MultiStackedBars: {
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
      // position: 'bottom',
      // justify: 'center',
      placement: 'bottom',
      padding: 14,
    }
  }
}
