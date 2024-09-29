import type { PresetPartial } from '@orbcharts/core'
import type { PresetRoseParams, PresetRoseLabelsParams, PresetSeriesLegendParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_ROSE_SCALING_BY_RADIUS: PresetPartial<'series', PresetRoseParams
& PresetRoseLabelsParams
& PresetSeriesLegendParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_ROSE_SCALING_BY_RADIUS',
  description: '以半徑尺寸為比例的玫瑰圖',
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
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
