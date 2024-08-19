import type { ChartParamsFile } from '../types'

export const CP_BOTTOM_AND_LEFT_PADDING_WITH_SERIES_HIGHLIGHT: ChartParamsFile = {
  id: 'CP_BOTTOM_AND_LEFT_PADDING_WITH_SERIES_HIGHLIGHT',
  description: '間距下面及左邊留空',
  data: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 160
    },
    highlightTarget: 'series'
  }
}