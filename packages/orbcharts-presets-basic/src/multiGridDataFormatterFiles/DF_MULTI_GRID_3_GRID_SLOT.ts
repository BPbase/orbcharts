import type { DataFormatterFile } from '../types'

export const DF_MULTI_GRID_3_GRID_SLOT: DataFormatterFile<'multiGrid'> = {
  id: 'DF_MULTI_GRID_3_GRID_SLOT',
  chartType: 'multiGrid',
  description: '3個Grid Slot',
  data: {
    // gridList: [
    //   {
    //     slotIndex: 0
    //   },
    //   {
    //     slotIndex: 1
    //   },
    //   {
    //     slotIndex: 2
    //   }
    // ],
    separateGrid: true,
    container: {
      rowAmount: 1,
      columnAmount: 3,
    }
  }
}