import type { DataFormatterFile } from '../types'

export const DF_MULTI_GRID_SEPARATE_GRID: DataFormatterFile<'multiGrid'> = {
  id: 'DF_MULTI_GRID_SEPARATE_GRID',
  chartType: 'multiGrid',
  description: '分開顯示Gird',
  data: {
    // gridList: [
    //   {
    //     // slotIndex: 0
    //   },
    //   {
    //     slotIndex: 1
    //   }
    // ],
    separateGrid: true,
    // container: {
    //   rowAmount: 1,
    //   columnAmount: 2,
    // }
  }
}