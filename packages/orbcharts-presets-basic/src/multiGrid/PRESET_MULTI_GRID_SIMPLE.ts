import type { PresetPartial } from '../../lib/core-types'
import type { 
  PresetMultiGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

export const PRESET_MULTI_GRID_SIMPLE: PresetPartial<'multiGrid', Partial<PresetMultiGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_MULTI_GRID_SIMPLE',
  description: 'Simple MultiGrid',
  descriptionZh: '簡單MultiGrid',
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
      bottom: 80,
      left: 40
    },
    highlightTarget: 'series'
  },
  dataFormatter: {
    gridList: [
      // 設定一個所有grid一起套用
      {
        valueAxis: {
          scaleRange: [0, 0.95]
        },
      },
    ],
  },
  pluginParams: {
    MultiGridLegend: {
      placement: 'bottom',
      padding: 7,
      gridList: [
        {
        },
        {
          listRectHeight: 2,
        }
      ]
    }
  }
}
