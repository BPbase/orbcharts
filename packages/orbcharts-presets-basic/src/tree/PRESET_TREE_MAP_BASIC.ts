import type { PresetPartial } from '../../lib/core-types'
import type { PresetTreePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_TREE_MAP_BASIC: PresetPartial<'tree', Partial<PresetTreePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_TREE_MAP_BASIC',
  description: 'Basic tree map',
  descriptionZh: '基本樹狀矩形圖',
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
      bottom: 70,
      left: 40
    },
  },
  pluginParams: {
    TreeMap: {},
    TreeLegend: {
      placement: 'bottom',
      padding: 14,
    }
  }
}
