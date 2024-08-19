import type { PluginParamsFile } from '../../types'
import type { GroupAxisParams } from '@orbcharts/plugins-basic'

export const PP_GROUP_AXIS_ROTATE_LABEL: PluginParamsFile<GroupAxisParams> = {
  id: 'PP_GROUP_AXIS_ROTATE_LABEL',
  chartType: 'grid',
  pluginName: 'GroupAxis',
  description: '群組圖軸標籤文字傾斜',
  data: {
    tickPadding: 15,
    tickTextRotate: -30
  }
}