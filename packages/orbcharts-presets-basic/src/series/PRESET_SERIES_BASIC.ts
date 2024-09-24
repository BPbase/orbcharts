import type { Preset } from '@orbcharts/core'
import type { PresetSeriesLegendParams } from '../PluginParams'

export const PRESET_SERIES_SUM_SERIES: Preset<'series', PresetSeriesLegendParams> = {
  name: 'PRESET_SERIES_SUM_SERIES',
  description: '基本Series參數',
  allPluginParams: {
    seriesLegend: {
      listRectRadius: 7
    }
  }
}
