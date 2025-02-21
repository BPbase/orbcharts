import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetSeriesTooltipParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_PIE_SIMPLE: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_PIE_SIMPLE',
  description: 'Simple pie chart',
  descriptionZh: '簡單圓餅圖',
  chartParams: {
    padding: {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30
    },
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
    }
  },
  dataFormatter: {
    sort: (a, b) => b.value - a.value
  },
  pluginParams: {
    SeriesLegend: {
      listRectRadius: 7, // 圓型圖例列點
      padding: 7
    }
  }
}
PRESET_PIE_SIMPLE.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`