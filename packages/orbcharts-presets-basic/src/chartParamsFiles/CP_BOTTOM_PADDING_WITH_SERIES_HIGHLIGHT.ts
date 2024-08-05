import type { ChartParamsFile } from '../types'

export const CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT: ChartParamsFile = {
  id: 'CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT',
  description: '間距下面留空及highlight系列',
  data: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 60
    },
    highlightTarget: 'series'
  }
}