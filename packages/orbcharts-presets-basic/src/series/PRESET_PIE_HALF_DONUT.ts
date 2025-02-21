import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_PIE_HALF_DONUT: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_PIE_HALF_DONUT',
  description: 'Half donut chart',
  descriptionZh: '半圓甜甜圈圖',
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
      top: 120,
      right: 60,
      bottom: 0,
      left: 60
    },
  },
  dataFormatter: {
    sort: (a, b) => b.value - a.value
  },
  allPluginParams: {
    Pie: {
      innerRadius: 0.5,
      startAngle: - Math.PI / 2,
      endAngle: Math.PI / 2,
    },
    PieLabels: {
      startAngle: - Math.PI / 2,
      endAngle: Math.PI / 2,
    },
    PieEventTexts: {},
    SeriesLegend: {
      placement: 'bottom',
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
PRESET_PIE_HALF_DONUT.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`