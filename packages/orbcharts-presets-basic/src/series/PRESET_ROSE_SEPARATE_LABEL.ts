import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_ROSE_SEPARATE_LABEL: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_ROSE_SEPARATE_LABEL',
  description: 'Separate rose chart of Label',
  descriptionZh: '分開顯示Label的玫瑰圖',
  chartParams: {
    padding: {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40
    },
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
    }
  },
  dataFormatter: {
    sort: (a, b) => b.value - a.value,
    separateLabel: true,
  },
  pluginParams: {
    RoseLabels: {
      labelFn: d => d.seriesLabel,
    }
  }
}
PRESET_ROSE_SEPARATE_LABEL.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`
PRESET_ROSE_SEPARATE_LABEL.pluginParams.RoseLabels.labelFn.toString = () => `d => d.seriesLabel`
