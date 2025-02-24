import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_PIE_WITH_INNER_LABELS: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_PIE_WITH_INNER_LABELS',
  description: 'Pie chart with inner data labels',
  descriptionZh: '圓餅圖及內部資料標籤',
  chartParams: {
    colors: {
      light: {
        label: [
          "#0088FF",
          "#4BABFF",
          "#38BEA8",
          "#86DC72",
          "#F9B052",
          "#F4721B",
          "#FF3232",
          "#5F2714",
          "#D117EA",
          "7E7D7D"
        ],
      },
      dark: {
        label: [
          "#4BABFF",
          "#8BC8FF",
          "#61CBB9",
          "#ACE1A0",
          "#FCDCAD",
          "#F9B052",
          "#FF6C6C",
          "#904026",
          "#EF76FF",
          "#C4C4C4"
        ]
      }
    }
  },
  dataFormatter: {
    sort: (a, b) => b.value - a.value
  },
  pluginParams: {
    Pie: {},
    PieLabels: {
      "labelCentroid": 1.3, // 圖內資料標籤
      "labelColorType": "labelContrast"
    },
    PieEventTexts: {},
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
PRESET_PIE_WITH_INNER_LABELS.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`