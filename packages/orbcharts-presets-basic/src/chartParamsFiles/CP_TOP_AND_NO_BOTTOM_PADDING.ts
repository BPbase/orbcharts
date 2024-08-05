import type { ChartParamsFile } from '../types'

export const CP_TOP_AND_NO_BOTTOM_PADDING: ChartParamsFile = {
  id: 'CP_TOP_AND_NO_BOTTOM_PADDING',
  description: '間距上面留空下面不留空',
  data: {
    padding: {
      top: 140,
      right: 120,
      bottom: 0,
      left: 60
    },
  }
}