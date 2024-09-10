import type { DataFormatterFile } from '../types'

export const DF_MULTI_LINE_AREAS_SEPARATE_GRID: DataFormatterFile<'multiGrid'> = {
  id: 'DF_MULTI_LINE_AREAS_SEPARATE_GRID',
  chartType: 'multiGrid',
  description: 'MultiLineAreas 分開顯示Gird',
  data: {
    gridList: [
      {
        // slotIndex: 0
        groupAxis: {
          scalePadding: 0
        }
      },
      {
        // slotIndex: 1,
        groupAxis: {
          scalePadding: 0
        }
      }
    ],
    separateGrid: true,
    // container: {
    //   rowAmount: 1,
    //   columnAmount: 2,
    // }
  }
}