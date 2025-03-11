import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_ORDINAL_BUBBLES_LINEAR_OPACITY: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_ORDINAL_BUBBLES_LINEAR_OPACITY',
  description: 'Ordinal bubbles with linear opacity',
  descriptionZh: '漸變透明度的序數泡泡圖',
  chartParams: {
    colors: {
      light: {
        label: [
          "#0088FF",
          "#FF3232",
          "#38BEA8",
          "#6F3BD5",
          "#314285",
          "#42C724",
          "#D52580",
          "#F4721B",
          "#D117EA",
          "#7E7D7D"
        ],
      },
      dark: {
        label: [
          "#4BABFF",
          "#FF6C6C",
          "#7DD3C4",
          "#8E6BC9",
          "#5366AC",
          "#86DC72",
          "#FF72BB",
          "#F9B052",
          "#EF76FF",
          "#C4C4C4"
        ]
      }
    },
    padding: {
      top: 60,
      right: 40,
      bottom: 60,
      left: 160
    },
  },
  pluginParams: {
    OrdinalBubbles: {
      bubble: {
        valueLinearOpacity: [0.5, 1]
      }
    },
    MultiValueLegend: {
      placement: 'bottom',
      padding: 14,
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
