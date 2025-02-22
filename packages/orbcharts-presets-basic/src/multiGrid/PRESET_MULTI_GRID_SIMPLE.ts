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
