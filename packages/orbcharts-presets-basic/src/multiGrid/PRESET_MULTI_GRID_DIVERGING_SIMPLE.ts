import type { PresetPartial } from '../../lib/core-types'
import type { 
  PresetMultiGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

export const PRESET_MULTI_GRID_DIVERGING_SIMPLE: PresetPartial<'multiGrid', Partial<PresetMultiGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_MULTI_GRID_DIVERGING_SIMPLE',
  description: 'Simple diverging Grid',
  descriptionZh: '簡單雙向Grid',
  chartParams: {
    colors: {
      light: {
        label: [
          "#0088FF",
          "#16B59B",
          "#6F3BD5",
          "#EE5F13",
          "#F9B052",
          "#D4785A",
          "#42C724",
          "#FF4B4B",
          "#1F3172",
          "#E23D93"
        ],
      },
      dark: {
        label: [
          "#4BABFF",
          "#7DD3C4",
          "#8454D4",
          "#FF6C6C",
          "#FAC77D",
          "#D58C75",
          "#42C724",
          "#FF8B8B",
          "#5366AC",
          "#FF8DC8"
        ]
      }
    },
    padding: {
      top: 40,
      right: 40,
      bottom: 60,
      left: 40
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
          position: 'bottom',
          scaleRange: [0, 0.95]
        },
      },
      // 第二個grid
      {
        groupAxis: {
          position: 'left'
        },
        valueAxis: {
          position: 'bottom',
          scaleRange: [0, 0.95]
        },
      }
    ],
    // 設定排版方式
    container: {
      columnGap: 140,
      rowAmount: 1,
      columnAmount: 2
    },
    separateGrid: true // 將兩個grid拆分
  },
  pluginParams: {
    MultiGroupAxis: {
      tickPadding: 10,
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
      padding: 7,
    }
  }
}
