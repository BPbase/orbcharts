import type { DataFormatterFile } from '../types'

export const DF_MULTI_GRID_2_GRID_SLOT: DataFormatterFile<'multiGrid'> = {
  id: 'DF_MULTI_GRID_2_GRID_SLOT',
  chartType: 'multiGrid',
  description: '2個Grid Slot',
  data: {
    gridList: [
      {
        // slotIndex: 0
      },
      {
        slotIndex: 1
      }
    ],
    container: {
      rowAmount: 1,
      columnAmount: 2,
    }
  }
}