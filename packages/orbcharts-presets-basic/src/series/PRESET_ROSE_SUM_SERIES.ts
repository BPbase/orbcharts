import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_ROSE_SUM_SERIES: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_ROSE_SUM_SERIES',
  description: 'Rose chart of combined Series data',
  descriptionZh: '合併Series資料的玫瑰圖',
  chartParams: {
    padding: {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40
    },
    colors: {
      light: {
        label:  [
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
    sumSeries: true
  },
  allPluginParams: {
  }
}
PRESET_ROSE_SUM_SERIES.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`
