import type { PresetPartial } from '../../lib/core-types'
import type { 
  PresetMultiGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

export const PRESET_MULTI_GRID_DIVERGING: PresetPartial<'multiGrid', Partial<PresetMultiGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_MULTI_GRID_DIVERGING',
  description: 'Diverging Grid',
  descriptionZh: '雙向Grid',
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
      },
      dark: {
        label: [
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
        ]
      }
    },
    padding: {
      top: 40,
      right: 40,
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
  pluginParams: {
    MultiGroupAxis: {
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
      placement: 'bottom',
      padding: 14,
    }
  }
}
