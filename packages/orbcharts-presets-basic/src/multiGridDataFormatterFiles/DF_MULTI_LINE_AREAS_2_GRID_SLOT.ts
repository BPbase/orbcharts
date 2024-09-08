import type { DataFormatterFile } from '../types'

export const DF_MULTI_LINE_AREAS_2_GRID_SLOT: DataFormatterFile<'multiGrid'> = {
  id: 'DF_MULTI_LINE_AREAS_2_GRID_SLOT',
  chartType: 'multiGrid',
  description: 'MultiLineAreas 2個Grid Slot',
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
    container: {
      rowAmount: 1,
      columnAmount: 2,
    }
  }
}