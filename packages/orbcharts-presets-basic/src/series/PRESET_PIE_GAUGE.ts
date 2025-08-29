import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_PIE_GAUGE: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_PIE_GAUGE',
  description: 'Gauge chart',
  descriptionZh: '儀表圖',
  chartParams: {
    // 和 Rose 一樣的配色
    colors: {
      light: {
        label: [
          "#4BABFF",
          "#0088FF",
          "#435399",
          "#86DC72",
          "#42C724",
          "#16B59B",
          "#F9B052",
          "#F4721B",
          "#FF3232",
          "#7E7D7D"
        ]
      },
      dark: {
        label: [
          "#8BC8FF",
          "#4BABFF",
          "#0088FF",
          "#55D339",
          "#29AB0C",
          "#16B59B",
          "#FCDCAD",
          "#F9B052",
          "#FF6C6C",
          "#C4C4C4"
        ]
      }
    },
    padding: {
      top: 120,
      right: 60,
      bottom: 0,
      left: 60
    },
  },
  pluginParams: {
    Pie: {
      outerRadius: 1,
      outerRadiusWhileHighlight: 1,
      innerRadius: 0.75,
      startAngle: - Math.PI / 2,
      endAngle: Math.PI / 2,
    },
    PieLabels: {},
    PieEventTexts: {
      textAttrs: [
        {
          "transform": "translate(0, -24)"
        }
      ],
      textStyles: [
        {
          "font-weight": "bold",
          "text-anchor": "middle",
          "pointer-events": "none",
          "dominant-baseline": "middle",
          "font-size": 24,
          "fill": "#000"
        }
      ]
    },
    Indicator: {
      startAngle: - Math.PI / 2,
      endAngle: Math.PI / 2,
      radius: 0.65,
      value: 0
    },
    SeriesLegend: {
      placement: 'bottom',
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}