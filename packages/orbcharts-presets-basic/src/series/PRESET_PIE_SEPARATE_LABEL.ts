import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_PIE_SEPARATE_LABEL: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_PIE_SEPARATE_LABEL',
  description: 'Separate pie chart of Label',
  descriptionZh: '分開顯示Label的圓餅圖',
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
    },
  },
  dataFormatter: {
    sort: (a, b) => b.value - a.value,
    separateLabel: true,
  },
  pluginParams: {
    PieLabels: {
      labelFn: d => d.seriesLabel
    }
  }
}
PRESET_PIE_SEPARATE_LABEL.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`
PRESET_PIE_SEPARATE_LABEL.pluginParams.PieLabels.labelFn.toString = () => `d => d.seriesLabel`