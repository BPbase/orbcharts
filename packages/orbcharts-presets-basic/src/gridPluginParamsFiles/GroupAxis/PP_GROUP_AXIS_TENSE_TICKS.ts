import type { PluginParamsFile } from '../../types'
import type { GroupAxisParams } from '@orbcharts/plugins-basic'

export const PP_GROUP_AXIS_TENSE_TICKS: PluginParamsFile<GroupAxisParams> = {
  id: 'PP_GROUP_AXIS_TENSE_TICKS',
  chartType: 'grid',
  pluginName: 'GroupAxis',
  description: '密集標籤',
  data: {
    ticks: 12,
    tickPadding: 15,
    tickTextRotate: -30
  }
}