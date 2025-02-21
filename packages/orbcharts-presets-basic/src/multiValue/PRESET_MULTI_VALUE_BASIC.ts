import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_MULTI_VALUE_BASIC: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_MULTI_VALUE_BASIC',
  description: 'Basic MultiValue',
  descriptionZh: '基本MultiValue參數',
  chartParams: {
    colors: {
      light: {
        label:  [
          "#7DD3C4",
          "#FFA0A0",
          "#6CBAFF",
          "#55D339",
          "#F9B052",
          "#FF6C6C",
          "#8E6BC9",
          "#0088FF",
          "#904026",
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
    }
  }
}
