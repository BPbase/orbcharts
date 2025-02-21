import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_SCATTER_BUBBLES_BASIC: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_SCATTER_BUBBLES_BASIC',
  description: 'Basic Scatter Bubbles',
  descriptionZh: '基本的散布泡泡圖',
  chartParams: {
    colors: {
      light: {
        label:  [
          "#6CBAFF",
          "#FF6C6C",
          "#F9B052",
          "#7DD3C4",
          "#AA93D2",
          "#0088FF",
          "#FFBABA",
          "#86DC72",
          "#EF76FF",
          "#C4C4C4"
        ],
      }
    },
    padding: {
      top: 40,
      right: 40,
      bottom: 100,
      left: 80
    },
  },
  allPluginParams: {
    MultiValueLegend: {
      placement: 'bottom',
      padding: 14,
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
