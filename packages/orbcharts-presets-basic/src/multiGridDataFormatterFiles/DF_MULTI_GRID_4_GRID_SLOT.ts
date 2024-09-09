import type { DataFormatterFile } from '../types'

export const DF_MULTI_GRID_4_GRID_SLOT: DataFormatterFile<'multiGrid'> = {
  id: 'DF_MULTI_GRID_4_GRID_SLOT',
  chartType: 'multiGrid',
  description: '4個Grid Slot',
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
    //   },
    //   {
    //     slotIndex: 3
    //   }
    // ],
    separateGrid: true,
    container: {
      rowAmount: 2,
      columnAmount: 2,
    }
  }
}