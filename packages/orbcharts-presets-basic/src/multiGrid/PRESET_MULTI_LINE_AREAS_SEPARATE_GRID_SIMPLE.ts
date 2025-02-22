import type { PresetPartial } from '../../lib/core-types'
import type { 
  PresetMultiGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

export const PRESET_MULTI_LINE_AREAS_SEPARATE_GRID_SIMPLE: PresetPartial<'multiGrid', Partial<PresetMultiGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_MULTI_LINE_AREAS_SEPARATE_GRID_SIMPLE',
  description: 'Simple separate grid line areas',
  descriptionZh: '簡單的分開顯示Grid的折線區域圖',
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
      top: 40,
      right: 80, // lineAre 的左右刻度靠邊，要避免太窄造成 label 超出
      bottom: 80,
      left: 80 // lineAre 的左右刻度靠邊，要避免太窄造成 label 超出
    },
  },
  dataFormatter: {
    gridList: [
      // 設定一個所有grid一起套用
      {
        groupAxis: {
          scalePadding: 0
        },
        valueAxis: {
          scaleRange: [0, 0.95]
        },
      },
    ],
    separateGrid: true,
    container: {
      gap: 160
    }
  },
  pluginParams: {
    MultiGroupAxis: {
      // tickTextRotate: -30,
      gridIndexes: 'all'
    },
    MultiValueAxis: {
      gridIndexes: 'all'
    },
    MultiStackedValueAxis: {
      gridIndexes: 'all'
    },
    MultiBars: {
      gridIndexes: 'all'
    },
    MultiStackedBars: {
      gridIndexes: 'all'
    },
    MultiBarsTriangle: {
      gridIndexes: 'all'
    },
    MultiLines: {
      gridIndexes: 'all'
    },
    MultiLineAreas: {
      gridIndexes: 'all'
    },
    MultiDots: {
      gridIndexes: 'all'
    },
    MultiGridLegend: {
      placement: 'bottom',
      padding: 7,
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
        },
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
