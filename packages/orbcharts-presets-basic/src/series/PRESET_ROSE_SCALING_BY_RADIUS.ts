import type { PresetPartial } from '../../lib/core-types'
import type { PresetSeriesPluginParams, PresetNoneDataPluginParams } from '../types'
// import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_ROSE_SCALING_BY_RADIUS: PresetPartial<'series', Partial<PresetSeriesPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_ROSE_SCALING_BY_RADIUS',
  description: '以半徑尺寸為比例的玫瑰圖',
  chartParams: {
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
    sort: (a, b) => b.value - a.value
  },
  allPluginParams: {
    // ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Rose: {
      arcScaleType: 'radius'
    },
    RoseLabels: {
      arcScaleType: 'radius',
    },
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
PRESET_ROSE_SCALING_BY_RADIUS.dataFormatter.sort.toString = () => `(a, b) => b.value - a.value`