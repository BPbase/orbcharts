import type { PresetPartial } from '../../lib/core-types'
import type { PresetTreePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_TREE_MAP_SIMPLE: PresetPartial<'tree', Partial<PresetTreePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_TREE_MAP_SIMPLE',
  description: 'Simple tree map',
  descriptionZh: '簡單樹狀矩形圖',
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
      right: 40,
      bottom: 40,
      left: 40
    },
  },
  pluginParams: {
    TreeMap: {},
    TreeLegend: {
      placement: 'bottom',
      padding: 7,
    }
  }
}
