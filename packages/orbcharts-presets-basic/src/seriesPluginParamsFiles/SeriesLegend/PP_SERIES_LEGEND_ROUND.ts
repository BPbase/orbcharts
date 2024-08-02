import type { PluginParamsFile } from '../../types'
import type { SeriesLegendParams } from '@orbcharts/plugins-basic'

export const PP_SERIES_LEGEND_ROUND: PluginParamsFile<SeriesLegendParams> = {
  id: 'PP_SERIES_LEGEND_BOTTOM',
  chartType: 'series',
  pluginName: 'SeriesLegend',
  description: '圓型圖例列點',
  data: {
    listRectRadius: 7
  }
}