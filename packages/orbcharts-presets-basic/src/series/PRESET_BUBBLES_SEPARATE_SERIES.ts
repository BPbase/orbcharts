import type { PresetPartial } from '../../lib/core-types'
import type { PresetBubblesParams, PresetSeriesLegendParams, PresetNoneDataPluginParams } from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

export const PRESET_BUBBLES_SEPARATE_SERIES: PresetPartial<'series', PresetBubblesParams
& PresetSeriesLegendParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_BUBBLES_SEPARATE_SERIES',
  description: '分開顯示Series泡泡',
  chartParams: {
    // 加長留空
    padding: {
      top: 160,
      right: 160,
      bottom: 160,
      left: 160
    },
  },
  dataFormatter: {
    separateSeries: true,
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    Bubbles: {},
    SeriesLegend: {
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
