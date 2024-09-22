import type { PluginParamsFile } from '../../types'
import type { GroupAxisParams } from '@orbcharts/plugins-basic'

export const PP_GROUP_AXIS_LOOSE_TICKS: PluginParamsFile<GroupAxisParams> = {
  id: 'PP_GROUP_AXIS_LOOSE_TICKS',
  chartType: 'grid',
  pluginName: 'GroupAxis',
  description: '寬鬆標籤',
  data: {
    ticks: 6
  }
}