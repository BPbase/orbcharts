import type { PresetPartial } from '../../lib/core-types'
import type { PresetBubblesParams, PresetSeriesLegendParams, PresetSeriesTooltipParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_BUBBLES_SCALING_BY_RADIUS: PresetPartial<'series', PresetBubblesParams
& PresetSeriesLegendParams
& PresetSeriesTooltipParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_BUBBLES_SCALING_BY_RADIUS',
  description: '以半徑尺寸為比例的泡泡圖',
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Bubbles: {
      arcScaleType: 'radius'
    },
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    },
    SeriesTooltip: {}
  },
}
