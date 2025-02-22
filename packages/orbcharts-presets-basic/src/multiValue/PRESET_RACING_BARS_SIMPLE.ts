import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_RACING_BARS_SIMPLE: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_RACING_BARS_SIMPLE',
  description: 'Simple racing bars',
  descriptionZh: '簡單賽跑長條圖',
  chartParams: {
    colors: {
      light: {
        label:  [
          "#4BABFF",
          "#FFA0A0",
          "#7DD3C4",
          "#F9B052",
          "#8454D4",
          "#42C724",
          "#FF4B4B",
          "#904026",
          "#4B25B3",
          "#C50669"
        ],
      }
    },
    padding: {
      top: 60,
      right: 40,
      bottom: 40,
      left: 40
    },
    transitionDuration: 500
  },
  pluginParams: {
    RacingBars: {
      autorun: true,
    },
    MultiValueLegend: {
      placement: 'bottom',
      padding: 7,
    }
  }
}
