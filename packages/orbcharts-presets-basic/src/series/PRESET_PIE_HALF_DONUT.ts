import type { PresetPartial } from '@orbcharts/core'
import type { PresetPieParams, PresetPieLabelsParams, PresetPieEventTextsParams, PresetSeriesLegendParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_PIE_HALF_DONUT: PresetPartial<'series', PresetPieParams
& PresetPieLabelsParams
& PresetPieEventTextsParams
& PresetSeriesLegendParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_PIE_HALF_DONUT',
  description: '半圓甜甜圈圖',
  chartParams: {
    padding: {
      top: 120,
      right: 120,
      bottom: 0,
      left: 60
    },
  },
  dataFormatter: {
    sort: (a, b) => b.value - a.value
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
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
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
PRESET_PIE_HALF_DONUT.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`