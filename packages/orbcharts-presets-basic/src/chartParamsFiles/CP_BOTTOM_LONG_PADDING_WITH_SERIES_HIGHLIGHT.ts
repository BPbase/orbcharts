import type { ChartParamsFile } from '../types'

export const CP_BOTTOM_LONG_PADDING_WITH_SERIES_HIGHLIGHT: ChartParamsFile = {
  id: 'CP_BOTTOM_LONG_PADDING_WITH_SERIES_HIGHLIGHT',
  description: '間距下面加長留空及highlight系列',
  data: {
    padding: {
      top: 60,
      right: 60,
      bottom: 140,
      left: 60
    },
    highlightTarget: 'series'
  }
}